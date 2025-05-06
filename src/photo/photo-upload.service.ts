import { Injectable } from '@nestjs/common';
import { PhotoExtractionService } from './photo-extraction.service';

import { UsersService } from 'src/users/users.service';
import { StateStatuses } from 'constants/telegram/enums/state-status.enum';
import { Context } from 'telegraf';
import { UserPhotoService } from './user-photo.service';
import { DocumentValidationService } from 'src/documents/document-validation.service';
import { ConfirmationService } from 'src/insurance/confirmation.service';

@Injectable()
export class PhotoUploadHandler {
  constructor(
    private readonly photoService: PhotoExtractionService,
    private readonly userPhotoService: UserPhotoService,
    private readonly documentValidationService: DocumentValidationService,
    private readonly confirmationService: ConfirmationService,
    private readonly userService: UsersService,
  ) {}

  async processPhotoUpload(ctx: Context) {
    const userId = this.userService.getUserId(ctx);

    const photoBuffers = await this.photoService.extractPhotos(ctx);
    this.userPhotoService.addPhotos(userId, photoBuffers);

    const userPhotos = this.userPhotoService.getPhotos(userId);
    const isPhotoCountSufficient =
      this.userPhotoService.isPhotoCountSufficient(userPhotos);

    if (!isPhotoCountSufficient) {
      return ctx.reply(
        this.userPhotoService.getPhotoProgressMessage(userPhotos.length),
      );
    }

    const passportData = await this.documentValidationService.validatePhotos(
      ctx,
      userId,
      userPhotos,
    );
    if (!passportData) return;
    this.userService.setState(userId, StateStatuses.DOCUMENTS_RECEIVED);

    await this.confirmationService.sendConfirmation(
      ctx,
      passportData.passport1,
    );
  }
}

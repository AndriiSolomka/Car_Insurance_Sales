import { Injectable } from '@nestjs/common';
import { PhotoExtractionService } from './photo-extraction.service';
import { UserPhotoService } from './user-photo.service';
import { UsersService } from 'src/users/users.service';
import { PhotoCountValidatorService } from './photo-count-validation.service';
import { DocumentsService } from 'src/documents/document.service';
import { Context } from 'telegraf';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';
import { OpenAiPromptsStatus } from 'src/constants/openai/prompts';

@Injectable()
export class PhotoUploadHandler {
  constructor(
    private readonly photoService: PhotoExtractionService,
    private readonly userPhotoService: UserPhotoService,
    private readonly userService: UsersService,
    private readonly photoCount: PhotoCountValidatorService,
    private readonly documentsService: DocumentsService,
    private readonly aiService: OpenaiPromptsService,
  ) {}

  async processPhotoUpload(ctx: Context) {
    const userId = this.userService.getUserId(ctx);
    const photoBuffers = await this.photoService.extractPhotos(ctx);
    this.userPhotoService.addPhotos(userId, photoBuffers);
    const userPhotos = this.userPhotoService.getPhotos(userId);

    const photoCount = userPhotos.length;
    const validation = await this.photoCount.validate(photoCount);
    if (validation) return ctx.reply(validation);

    const passportData = await this.documentsService.validate(userPhotos);
    if (!passportData) {
      this.userService.clearUserData(userId);
      return ctx.reply(
        await this.aiService.askPrompt(
          OpenAiPromptsStatus.RETRY_DOCUMENT_UPLOAD,
        ),
      );
    }

    this.userService.setPassportData(userId, passportData);
    return this.documentsService.requestDataConfirmation(
      ctx,
      userId,
      userPhotos,
      passportData,
    );
  }
}

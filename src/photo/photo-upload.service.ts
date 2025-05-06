import { Injectable } from '@nestjs/common';
import { PhotoExtractionService } from './photo-extraction.service';

import { UsersService } from 'src/users/users.service';
import { StateStatuses } from 'src/constants/telegram/enums/state-status.enum';
import { Context } from 'telegraf';
import { UserPhotoService } from './user-photo.service';
import { DocumentValidationService } from 'src/documents/document-validation.service';
import { ConfirmationService } from 'src/insurance/confirmation.service';
import { OpenAiService } from 'src/openai/openai.service';
import { OpenAiPrompts } from 'src/constants/openai/promts';

@Injectable()
export class PhotoUploadHandler {
  constructor(
    private readonly photoService: PhotoExtractionService,
    private readonly userPhotoService: UserPhotoService,
    private readonly documentValidationService: DocumentValidationService,
    private readonly confirmationService: ConfirmationService,
    private readonly userService: UsersService,
    private readonly openAiService: OpenAiService,
  ) {}

  async processPhotoUpload(ctx: Context) {
    const userId = this.userService.getUserId(ctx);

    const photoBuffers = await this.photoService.extractPhotos(ctx);
    this.userPhotoService.addPhotos(userId, photoBuffers);

    const userPhotos = this.userPhotoService.getPhotos(userId);

    if (userPhotos.length > 2) {
      const prompt = `Пользователь загрузил ${userPhotos.length} фото, а необходимо только 2. Попросите удалить лишние и загрузить заново.`;
      const aiResponse = await this.openAiService.ask(prompt);
      this.userPhotoService.clearPhotos(userId);
      return ctx.reply(
        aiResponse ||
          `Вы загрузили ${userPhotos.length} фото, но нужно только 2. Пожалуйста, загрузите только 2 фотографии.`,
      );
    }

    if (userPhotos.length < 2) {
      const prompt = `Пользователь загрузил ${userPhotos.length} фото. Сообщите, что нужно загрузить еще одну фотографию.`;
      const aiResponse = await this.openAiService.ask(prompt);
      return ctx.reply(
        aiResponse ||
          `Вы загрузили ${userPhotos.length} фото. Пожалуйста, загрузите ещё одну фотографию.`,
      );
    }

    // Достаточно фото — продолжаем
    const passportData = await this.documentValidationService.validatePhotos(
      ctx,
      userId,
      userPhotos,
    );
    if (!passportData) return;

    this.userService.setState(userId, StateStatuses.DOCUMENTS_RECEIVED);

    const prompt = OpenAiPrompts.DOCUMENT_UPLOAD_SUCCESS;
    const aiResponse = await this.openAiService.ask(prompt);

    await ctx.reply(aiResponse || 'Документы успешно загружены.');
    await this.confirmationService.sendConfirmation(
      ctx,
      passportData.passport1,
    );
  }
}

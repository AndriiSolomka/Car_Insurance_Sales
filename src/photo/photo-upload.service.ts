import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { PhotoExtractionService } from './photo-extraction.service';
import { UserPhotoService } from './user-photo.service';
import { DocumentValidationService } from 'src/documents/document-validation.service';
import { ConfirmationService } from 'src/insurance/confirmation.service';
import { UsersService } from 'src/users/users.service';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';

import { StateStatuses } from 'src/constants/telegram/enums/state-status.enum';
import { OpenAiPromptsStatus } from 'src/constants/openai/prompts';
import { REQUIRED_PHOTO_COUNT } from 'src/constants/telegram/enums/photo';
import { PhotoUploadData } from 'src/constants/photo/types/photo.interface';

@Injectable()
export class PhotoUploadHandler {
  constructor(
    private readonly photoService: PhotoExtractionService,
    private readonly userPhotoService: UserPhotoService,
    private readonly documentService: DocumentValidationService,
    private readonly confirmationService: ConfirmationService,
    private readonly userService: UsersService,
    private readonly aiService: OpenaiPromptsService,
  ) {}

  async processPhotoUpload(ctx: Context) {
    const userId = this.userService.getUserId(ctx);
    const photoBuffers = await this.photoService.extractPhotos(ctx);
    this.userPhotoService.addPhotos(userId, photoBuffers);

    const userPhotos = this.userPhotoService.getPhotos(userId);
    const photoCount = userPhotos.length;
    const validation = await this.validatePhotoCount(userId, photoCount);

    if (validation) return ctx.reply(validation);
    await this.processValidPhotos({ ctx, userId, userPhotos });
  }

  private async validatePhotoCount(userId: string, photoCount: number) {
    if (photoCount > +REQUIRED_PHOTO_COUNT.COUNT) {
      this.userPhotoService.clearPhotos(userId);
      const aiResponse = await this.aiService.askPrompt(
        OpenAiPromptsStatus.DOCUMENT_UPLOAD_TOO_MANY,
      );
      return aiResponse;
    }

    if (photoCount < +REQUIRED_PHOTO_COUNT.COUNT) {
      const aiResponse = await this.aiService.askPrompt(
        OpenAiPromptsStatus.DOCUMENT_UPLOAD_INSUFFICIENT,
      );
      return aiResponse;
    }
    return null;
  }

  private async processValidPhotos(data: PhotoUploadData) {
    const { ctx, userId, userPhotos } = data;

    const passportData = await this.documentService.validatePhotos(
      ctx,
      userId,
      userPhotos,
    );

    if (!passportData) return;

    // Сохраняем паспортные данные
    this.userService.setPassportData(userId, passportData);

    // Проверяем, если два фото загружены, предложим цену
    if (userPhotos.length === +REQUIRED_PHOTO_COUNT.COUNT) {
      this.userService.setState(
        userId,
        StateStatuses.WAITING_FOR_PRICE_CONFIRMATION,
      );
      const aiResponse = await this.aiService.askPrompt(
        OpenAiPromptsStatus.SEND_PRICE,
      );
      return ctx.reply(aiResponse);
    }

    this.userService.setState(userId, StateStatuses.DOCUMENTS_RECEIVED);
    const aiResponse = await this.aiService.askPrompt(
      OpenAiPromptsStatus.DOCUMENT_UPLOAD_SUCCESS,
    );

    await ctx.reply(aiResponse);
    await this.confirmationService.sendConfirmation(ctx, passportData);
  }
}

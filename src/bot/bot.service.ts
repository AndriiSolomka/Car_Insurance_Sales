import { Injectable } from '@nestjs/common';
import { StateStatuses } from 'src/constants/telegram/enums/state-status.enum';
import { PhotoUploadHandler } from 'src/photo/photo-upload-handler.service';
import { UsersService } from 'src/users/users.service';
import { isPositiveAnswer } from 'src/utils/filter/filterAnswers';
import { Context } from 'telegraf';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';
import { OpenAiPromptsStatus } from 'src/constants/openai/prompts';
import { InsuranceService } from 'src/insurance/insurance.service';

@Injectable()
export class BotService {
  constructor(
    private readonly userService: UsersService,
    private readonly photoUploadHandler: PhotoUploadHandler,
    private readonly aiService: OpenaiPromptsService,
    private readonly insuranceService: InsuranceService,
  ) {}

  async start(ctx: Context) {
    const userId = this.userService.getUserId(ctx);
    this.userService.clearUserData(userId);
    this.userService.setState(userId, StateStatuses.WAITING_FOR_DOCUMENTS);
    return ctx.reply(await this.aiService.askPrompt(OpenAiPromptsStatus.START));
  }

  async uploadPhoto(ctx: Context) {
    try {
      return this.photoUploadHandler.processPhotoUpload(ctx);
    } catch {
      const userId = this.userService.getUserId(ctx);
      this.userService.clearUserData(userId);
      return ctx.reply(
        await this.aiService.askPrompt(
          OpenAiPromptsStatus.RETRY_DOCUMENT_UPLOAD,
        ),
      );
    }
  }

  async confirmData(ctx: Context) {
    const userId = this.userService.getUserId(ctx);
    const state = this.userService.getState(userId);

    switch (state) {
      case StateStatuses.WAITING_FOR_DATA_CONFIRMATION:
        return this.handleDataConfirmation(ctx, userId);
      case StateStatuses.WAITING_FOR_PRICE_CONFIRMATION:
        return this.handlePriceConfirmation(ctx, userId);
      case StateStatuses.WAITING_FOR_DOCUMENTS:
        return this.handleDocumentsUploaded(ctx, userId);
      default:
        this.userService.clearUserData(userId);
        return ctx.reply(
          await this.aiService.askPrompt(
            OpenAiPromptsStatus.RETRY_DOCUMENT_UPLOAD,
          ),
        );
    }
  }

  private async handleDataConfirmation(ctx: Context, userId: string) {
    if (isPositiveAnswer(ctx)) {
      this.userService.setState(
        userId,
        StateStatuses.WAITING_FOR_PRICE_CONFIRMATION,
      );
      return ctx.reply(
        await this.aiService.askPrompt(OpenAiPromptsStatus.SEND_PRICE),
      );
    } else {
      this.userService.setState(userId, StateStatuses.WAITING_FOR_DOCUMENTS);
      return ctx.reply(
        await this.aiService.askPrompt(OpenAiPromptsStatus.DATA_REJECTED),
      );
    }
  }

  private async handlePriceConfirmation(ctx: Context, userId: string) {
    if (isPositiveAnswer(ctx)) {
      const passportData = this.userService.getPassportData(userId);
      this.userService.setState(userId, StateStatuses.COMPLETED);
      this.userService.clearUserData(userId);
      return this.insuranceService.sendPolice(ctx, passportData);
    } else {
      return ctx.reply(
        await this.aiService.askPrompt(OpenAiPromptsStatus.CONFIRM_PRICE_NO),
      );
    }
  }

  private async handleDocumentsUploaded(ctx: Context, userId: string) {
    this.userService.setState(
      userId,
      StateStatuses.WAITING_FOR_DATA_CONFIRMATION,
    );
    return ctx.reply(
      await this.aiService.askPrompt(
        OpenAiPromptsStatus.CONFIRM_EXTRACTED_DATA,
      ),
    );
  }
}

import { Injectable } from '@nestjs/common';
import { StateStatuses } from 'src/constants/telegram/enums/state-status.enum';
import { PhotoUploadHandler } from 'src/photo/photo-upload.service';
import { UsersService } from 'src/users/users.service';
import { isPositiveAnswer } from 'src/utils/filter/filterAnswers';
import { Context } from 'telegraf';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';
import { OpenAiPromptsStatus } from 'src/constants/openai/prompts';
import { ConfirmationService } from 'src/insurance/confirmation.service';

@Injectable()
export class BotService {
  constructor(
    private readonly userService: UsersService,
    private readonly photoUploadHandler: PhotoUploadHandler,
    private readonly aiService: OpenaiPromptsService,
    private readonly confirmationService: ConfirmationService,
  ) {}

  async start(ctx: Context) {
    const userId = this.userService.getUserId(ctx);
    this.userService.setState(userId, StateStatuses.WAITING_FOR_DOCUMENTS);
    return ctx.reply(await this.aiService.askPrompt(OpenAiPromptsStatus.START));
  }

  async uploadPhoto(ctx: Context) {
    return this.photoUploadHandler.processPhotoUpload(ctx);
  }

  async confirmPrice(ctx: Context) {
    const userId = this.userService.getUserId(ctx);

    if (isPositiveAnswer(ctx)) {
      this.userService.setState(userId, StateStatuses.COMPLETED);
      const passportData = this.userService.getPassportData(userId);
      return await this.confirmationService.sendConfirmation(ctx, passportData);
    }

    return await this.aiService.askPrompt(OpenAiPromptsStatus.CONFIRM_PRICE_NO);
  }
}

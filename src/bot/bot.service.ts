import { Injectable } from '@nestjs/common';
import { StateStatuses } from 'src/constants/telegram/enums/state-status.enum';
import { PhotoUploadHandler } from 'src/photo/photo-upload.service';
import { UsersService } from 'src/users/users.service';
import { isPositiveAnswer } from 'src/utils/filter/filterAnswers';
import { Context } from 'telegraf';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';
import { OpenAiPromptsStatus } from 'src/constants/openai/prompts';

@Injectable()
export class BotService {
  constructor(
    private readonly userService: UsersService,
    private readonly photoUploadHandler: PhotoUploadHandler,
    private readonly aiService: OpenaiPromptsService,
  ) {}

  async start(ctx: Context) {
    const userId = this.userService.getUserId(ctx);
    this.userService.setState(userId, StateStatuses.WAITING_FOR_DOCUMENTS);
    const aiResponse = await this.aiService.askPrompt(
      OpenAiPromptsStatus.START,
    );

    return ctx.reply(aiResponse);
  }

  async uploadPhoto(ctx: Context) {
    return this.photoUploadHandler.processPhotoUpload(ctx);
  }

  async confirmPrice(ctx: Context) {
    const userId = this.userService.getUserId(ctx);

    if (isPositiveAnswer(ctx)) {
      this.userService.setState(userId, StateStatuses.COMPLETED);
      const aiResponse = await this.aiService.askPrompt(
        OpenAiPromptsStatus.CONFIRM_PRICE_YES,
      );
      return ctx.reply(aiResponse);
    }

    const aiResponse = await this.aiService.askPrompt(
      OpenAiPromptsStatus.CONFIRM_PRICE_NO,
    );
    return ctx.reply(aiResponse);
  }
}

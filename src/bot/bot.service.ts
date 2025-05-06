import { Injectable } from '@nestjs/common';
import { StateStatuses } from 'src/constants/telegram/enums/state-status.enum';
import { PhotoUploadHandler } from 'src/photo/photo-upload.service';
import { UsersService } from 'src/users/users.service';
import { isPositiveAnswer } from 'src/utils/filter/filterAnswers';
import { Context } from 'telegraf';
import { OpenAiService } from 'src/openai/openai.service';
import { OpenAiPrompts } from 'src/constants/openai/promts';

@Injectable()
export class BotService {
  constructor(
    private readonly userService: UsersService,
    private readonly photoUploadHandler: PhotoUploadHandler,
    private readonly openAiService: OpenAiService,
  ) {}

  async start(ctx: Context) {
    const userId = this.userService.getUserId(ctx);
    this.userService.setState(userId, StateStatuses.WAITING_FOR_DOCUMENTS);

    const prompt = OpenAiPrompts.START;
    const aiResponse = await this.processWithAI(prompt);

    return ctx.reply(aiResponse);
  }

  async uploadPhoto(ctx: Context) {
    return this.photoUploadHandler.processPhotoUpload(ctx);
  }

  async confirmPrice(ctx: Context) {
    const userId = this.userService.getUserId(ctx);

    if (isPositiveAnswer(ctx)) {
      this.userService.setState(userId, StateStatuses.COMPLETED);
      const prompt = OpenAiPrompts.CONFIRM_PRICE_YES;
      const aiResponse = await this.processWithAI(prompt);
      return ctx.reply(aiResponse);
    }

    const prompt = OpenAiPrompts.CONFIRM_PRICE_NO;
    const aiResponse = await this.processWithAI(prompt);

    return ctx.reply(aiResponse);
  }

  async processWithAI(prompt: string): Promise<string> {
    try {
      const aiResponse = await this.openAiService.ask(prompt);
      return aiResponse || OpenAiPrompts.ERROR;
    } catch (error) {
      console.error('OpenAI Error:', error);
      return OpenAiPrompts.ERROR;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { BotMessages } from 'constants/telegram/enums/bot-messages.enum';
import { StateStatuses } from 'constants/telegram/enums/state-status.enum';
import { MindeeService } from 'src/mindee/mindee.service';
import { TelegramService } from 'src/telegram/telegram.service';
import { Context } from 'telegraf';

@Injectable()
export class BotService {
  private state = new Map<string, string>();

  constructor(
    private readonly telegram: TelegramService,
    private readonly mindee: MindeeService,
  ) {}

  async start(ctx: Context) {
    const userId = this.getUserId(ctx);
    this.state.set(userId, StateStatuses.WAITING_FOR_DOCUMENTS);
    return ctx.reply(BotMessages.WELCOME);
  }

  async handlePhoto(ctx: Context) {
    const userId = this.getUserId(ctx);
    const currentState = this.state.get(userId);

    if (currentState !== StateStatuses.WAITING_FOR_DOCUMENTS) {
      return ctx.reply(BotMessages.INVALID_STATE_FOR_PHOTO);
    }

    this.state.set(userId, StateStatuses.DOCUMENTS_RECEIVED);

    if (ctx.message && 'photo' in ctx.message) {
      const photoSizes = ctx.message.photo;
      const largestPhoto = photoSizes[photoSizes.length - 1];
      const fileId = largestPhoto.file_id;
      const buffer = await this.telegram.downloadFile(fileId);
      return buffer;
    }

    return ctx.reply(BotMessages.ERROR_WITH_HANDLE_PHOTO);
  }

  async uploadPhoto(ctx: Context) {
    const buffer = (await this.handlePhoto(ctx)) as ArrayBuffer;
    const result = await this.mindee.getPassportInfo(buffer);
    return ctx.reply(result);
  }

  private getUserId(ctx: Context) {
    return ctx.chat?.id?.toString() ?? 'unknown_user';
  }
}

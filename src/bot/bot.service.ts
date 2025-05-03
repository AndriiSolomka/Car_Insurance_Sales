import { Injectable } from '@nestjs/common';
import { BotMessages } from 'constants/telegram/enums/bot-messages.enum';
import { StateStatuses } from 'constants/telegram/enums/state-status.enum';
import { TelegramService } from 'src/telegram/telegram.service';
import { Context } from 'telegraf';

@Injectable()
export class BotService {
  private state = new Map<string, string>();

  constructor(private readonly telegram: TelegramService) {}

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

  private getUserId(ctx: Context) {
    return ctx.chat?.id?.toString() ?? 'unknown_user';
  }
}

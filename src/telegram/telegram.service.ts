import { Injectable } from '@nestjs/common';
import { BotMessages } from 'constants/telegram/bot-messages.enum';
import { StateStatuses } from 'constants/telegram/state-status.enum';
import { Context } from 'telegraf';

@Injectable()
export class TelegramService {
  private state = new Map<string, string>();

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

    return ctx.reply(BotMessages.PHOTO_RECEIVED);
  }

  private getUserId(ctx: Context) {
    return ctx.chat?.id?.toString() ?? 'unknown_user';
  }
}

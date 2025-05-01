import { Injectable } from '@nestjs/common';
import { BotMessages } from 'constants/telegram/greeting';
import { Context } from 'telegraf';

@Injectable()
export class TelegramService {
  async start(ctx: Context) {
    return ctx.reply(BotMessages.WELCOME);
  }
}

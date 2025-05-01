import { Update, Ctx, Start, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await this.telegramService.start(ctx);
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    await this.telegramService.handlePhoto(ctx);
  }
}

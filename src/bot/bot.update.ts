import { Update, Ctx, Start, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotService } from './bot.service';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context) {
    await this.botService.uploadPhoto(ctx);
  }
}

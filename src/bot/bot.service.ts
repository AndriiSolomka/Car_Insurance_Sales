import { Injectable } from '@nestjs/common';
import { BotMessages } from 'constants/telegram/enums/bot-messages.enum';
import { StateStatuses } from 'constants/telegram/enums/state-status.enum';
import { PhotoService } from 'src/photo/photo.service';
import { UsersService } from 'src/users/users.service';
import { isPositiveAnswer } from 'src/utils/filter/filterAnswers';
import { Context } from 'telegraf';

@Injectable()
export class BotService {
  constructor(
    private readonly userService: UsersService,
    private readonly photoUploadHandler: PhotoService,
  ) {}

  async start(ctx: Context) {
    const userId = this.getUserId(ctx);
    this.userService.setState(userId, StateStatuses.WAITING_FOR_DOCUMENTS);
    return ctx.reply(BotMessages.WELCOME);
  }

  async uploadPhoto(ctx: Context) {
    return this.photoUploadHandler.handle(ctx);
  }

  async confirmPrice(ctx: Context) {
    const userId = this.getUserId(ctx);
    if (isPositiveAnswer(ctx)) {
      this.userService.setState(userId, StateStatuses.COMPLETED);
      return ctx.reply(BotMessages.CONFIRMED);
    }
    return ctx.reply(BotMessages.ONLY_ONE_PRICE);
  }

  private getUserId(ctx: Context): string {
    return ctx.chat?.id?.toString() ?? 'unknown_user';
  }
}

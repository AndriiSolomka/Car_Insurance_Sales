import { Injectable } from '@nestjs/common';
import { BotMessages } from 'constants/telegram/enums/bot-messages.enum';
import { StateStatuses } from 'constants/telegram/enums/state-status.enum';
import { PhotoUploadHandler } from 'src/photo/photo-upload.service';
import { UsersService } from 'src/users/users.service';
import { isPositiveAnswer } from 'src/utils/filter/filterAnswers';
import { Context } from 'telegraf';

@Injectable()
export class BotService {
  constructor(
    private readonly userService: UsersService,
    private readonly photoUploadHandler: PhotoUploadHandler,
  ) {}

  async start(ctx: Context) {
    const userId = this.userService.getUserId(ctx);
    this.userService.setState(userId, StateStatuses.WAITING_FOR_DOCUMENTS);
    return ctx.reply(BotMessages.WELCOME);
  }

  async uploadPhoto(ctx: Context) {
    return this.photoUploadHandler.processPhotoUpload(ctx);
  }

  async confirmPrice(ctx: Context) {
    const userId = this.userService.getUserId(ctx);
    if (isPositiveAnswer(ctx)) {
      this.userService.setState(userId, StateStatuses.COMPLETED);
      return ctx.reply(BotMessages.CONFIRMED);
    }

    return ctx.reply(BotMessages.ONLY_ONE_PRICE);
  }
}

import { Injectable } from '@nestjs/common';
import { DocumentsService } from './document.service';
import { UsersService } from 'src/users/users.service';
import { BotMessages } from 'constants/telegram/enums/bot-messages.enum';
import { Context } from 'telegraf';

@Injectable()
export class DocumentValidationService {
  constructor(
    private readonly documentService: DocumentsService,
    private readonly userService: UsersService,
  ) {}

  async validatePhotos(ctx: Context, userId: string, photos: Buffer[]) {
    const validation = await this.documentService.validate(photos);

    if (!validation) {
      this.userService.clearPhotos(userId);
      await ctx.reply(BotMessages.INVALID_PASSPORT_DATA);
      return null;
    }

    return validation;
  }
}

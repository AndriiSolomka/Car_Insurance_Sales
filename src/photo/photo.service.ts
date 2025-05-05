import { Injectable } from '@nestjs/common';
import {
  BotMessages,
  photoProgressMessage,
} from 'constants/telegram/enums/bot-messages.enum';
import { StateStatuses } from 'constants/telegram/enums/state-status.enum';
import { DocumentValidatorService } from 'src/documents/validator.service';
import { TelegramService } from 'src/telegram/telegram.service';
import { UsersService } from 'src/users/users.service';
import { getLargestPhotoFileId } from 'src/utils/filter/filterPhotos';
import { Context } from 'telegraf';

@Injectable()
export class PhotoService {
  private readonly REQUIRED_PHOTO_COUNT = 2;

  constructor(
    private readonly telegram: TelegramService,
    private readonly userService: UsersService,
    private readonly documentValidator: DocumentValidatorService,
  ) {}

  async extractPhotos(ctx: Context): Promise<Buffer[]> {
    const photoIds = this.extractPhotoIdsFromContext(ctx);
    if (!photoIds.length) return [];
    const buffer = await this.downloadLargestPhotoById(photoIds);
    return [buffer];
  }

  private extractPhotoIdsFromContext(ctx: Context): string[] {
    if (ctx.message && 'photo' in ctx.message) {
      return ctx.message.photo.map((p) => p.file_id);
    }
    return [];
  }

  private async downloadLargestPhotoById(photoIds: string[]): Promise<Buffer> {
    const largestId = getLargestPhotoFileId(photoIds);
    return await this.telegram.downloadFile(largestId);
  }

  async handle(ctx: Context) {
    const userId = this.getUserId(ctx);

    const photoBuffers = await this.extractPhotos(ctx);
    this.userService.addPhotos(userId, photoBuffers);

    const userPhotos = this.userService.getPhotos(userId);
    const isCorrectPhotoCount = userPhotos.length === this.REQUIRED_PHOTO_COUNT;

    if (!isCorrectPhotoCount)
      return ctx.reply(
        `${photoProgressMessage(userPhotos.length, this.REQUIRED_PHOTO_COUNT)}`,
      );

    return this.validateAndRespond(ctx, userId, userPhotos);
  }

  private async validateAndRespond(
    ctx: Context,
    userId: string,
    photos: Buffer[],
  ) {
    const validation = await this.documentValidator.validate(photos);

    if (!validation) {
      this.userService.clearPhotos(userId);
      return ctx.reply(BotMessages.INVALID_PASSPORT_DATA);
    }

    this.userService.setState(userId, StateStatuses.DOCUMENTS_RECEIVED);

    await ctx.reply(
      `${BotMessages.DOCUMENTS_RECEIVED}\n
      ${JSON.stringify(validation.passportData, null, 2)}`,
    );

    return ctx.reply(BotMessages.PRICE_OFFER);
  }

  private getUserId(ctx: Context): string {
    return ctx.chat?.id?.toString() ?? 'unknown_user';
  }
}

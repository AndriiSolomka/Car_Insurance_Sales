import { Injectable } from '@nestjs/common';
import {
  BotMessages,
  photoProgressMessage,
} from 'constants/telegram/enums/bot-messages.enum';
import { REQUIRED_PHOTO_COUNT } from 'constants/telegram/enums/photo';
import { StateStatuses } from 'constants/telegram/enums/state-status.enum';
import { IPassportData } from 'constants/telegram/types/filterDocument.interface';
import { DocumentValidatorService } from 'src/documents/validator.service';
import { InsuranceService } from 'src/insurance/insurance.service';
import { OpenAiService } from 'src/openai/openai.service';
import { TelegramService } from 'src/telegram/telegram.service';
import { UsersService } from 'src/users/users.service';
import { getLargestPhotoFileId } from 'src/utils/filter/filterPhotos';
import { Context } from 'telegraf';

@Injectable()
export class PhotoService {
  constructor(
    private readonly telegram: TelegramService,
    private readonly userService: UsersService,
    private readonly documentValidator: DocumentValidatorService,
    private readonly openAiService: OpenAiService,
    private readonly insuranceService: InsuranceService,
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

  async processPhotoUpload(ctx: Context) {
    const userId = this.getUserId(ctx);

    const photoBuffers = await this.extractPhotos(ctx);
    this.userService.addPhotos(userId, photoBuffers);

    const userPhotos = this.userService.getPhotos(userId);
    const isPhotoCountSufficient = this.checkPhotoCount(userPhotos);

    if (!isPhotoCountSufficient)
      return ctx.reply(
        `${photoProgressMessage(userPhotos.length, REQUIRED_PHOTO_COUNT.COUNT)}\n`,
      );

    return this.validateAndRespond(ctx, userId, userPhotos);
  }

  private async validateAndRespond(
    ctx: Context,
    userId: string,
    photos: Buffer[],
  ) {
    const validation = await this.documentValidator.validate(photos);

    if (!validation || !validation.passportData) {
      this.userService.clearPhotos(userId);
      return ctx.reply('Неверные паспортные данные.');
    }

    this.userService.setState(userId, StateStatuses.DOCUMENTS_RECEIVED);

    await ctx.reply(
      `Документы получены\n${JSON.stringify(validation.passportData, null, 2)}`,
    );

    // const policyText = await this.insuranceService.generatePolicy(
    //   validation.passportData,
    // );

    const policyText = this.insuranceService.generatePolicy(
      validation.passportData,
    );

    await ctx.reply('✅ Ваш страховой полис:');
    await ctx.reply(policyText);
  }
  private getUserId(ctx: Context): string {
    return ctx.chat?.id?.toString() ?? 'unknown_user';
  }

  private checkPhotoCount(userPhotos: Buffer[]): boolean {
    return userPhotos.length === Number(REQUIRED_PHOTO_COUNT.COUNT);
  }
}

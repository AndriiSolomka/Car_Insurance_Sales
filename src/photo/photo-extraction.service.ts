import { Injectable } from '@nestjs/common';
import { TelegramService } from 'src/telegram/telegram.service';
import { getLargestPhotoFileId } from 'src/utils/filter/filterPhotos';
import { Context } from 'telegraf';

@Injectable()
export class PhotoExtractionService {
  constructor(private readonly telegram: TelegramService) {}

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
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramGetFileResponse } from 'constants/telegram/types/types';
import { FetchService } from 'src/fetch/fetch.service';

@Injectable()
export class TelegramService {
  private readonly tgUrl: string;
  private readonly botToken: string;

  constructor(
    private readonly config: ConfigService,
    private readonly fetch: FetchService,
  ) {
    this.tgUrl = this.config.get<string>('TELEGRAM_URL') ?? '';
    this.botToken = this.config.get<string>('TELEGRAM_BOT_TOKEN') ?? '';
  }

  private buildGetFileUrl(fileId: string): string {
    return `${this.tgUrl}/bot${this.botToken}/getFile?file_id=${fileId}`;
  }

  private buildDownloadUrl(filePath: string): string {
    return `${this.tgUrl}/file/bot${this.botToken}/${filePath}`;
  }

  async getFilePath(fileId: string): Promise<string> {
    const url = this.buildGetFileUrl(fileId);
    const response = await this.fetch.get<TelegramGetFileResponse>(url);
    const filePath = response.result.file_path;
    return filePath;
  }

  async downloadFile(fileId: string) {
    const filePath = await this.getFilePath(fileId);
    const downloadUrl = this.buildDownloadUrl(filePath);
    const buffer = await this.fetch.get(downloadUrl);
    return buffer;
  }
}

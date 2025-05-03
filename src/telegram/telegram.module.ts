import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { FetchModule } from 'src/fetch/fetch.module';

@Module({
  imports: [FetchModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}

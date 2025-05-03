import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { FetchModule } from './fetch/fetch.module';
import { MindeeModule } from './mindee/mindee.module';
import { TelegramModule } from './telegram/telegram.module';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegramModule,
    FetchModule,
    MindeeModule,
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

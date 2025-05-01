import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './telegram/telegram.module';
import { FetchModule } from './fetch/fetch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegramModule,
    FetchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MindeeModule } from 'src/mindee/mindee.module';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN') || '',
      }),
      inject: [ConfigService],
    }),
    MindeeModule,
    TelegramModule,
  ],

  providers: [BotService, BotUpdate],
})
export class BotModule {}

import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { UsersModule } from 'src/users/users.module';
import { PhotoModule } from 'src/photo/photo.module';
import { OpenaiPromptsModule } from 'src/openai-prompts/openai-prompts.module';
import { InsuranceModule } from 'src/insurance/insurance.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN') || '',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PhotoModule,
    OpenaiPromptsModule,
    InsuranceModule,
  ],

  providers: [BotService, BotUpdate],
})
export class BotModule {}

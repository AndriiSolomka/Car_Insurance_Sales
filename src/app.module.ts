import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { FetchModule } from './fetch/fetch.module';
import { MindeeModule } from './mindee/mindee.module';
import { TelegramModule } from './telegram/telegram.module';
import { BotModule } from './bot/bot.module';
import { UsersModule } from './users/users.module';
import { PhotoModule } from './photo/photo.module';
import { DocumentsModule } from './documents/documents.module';
import { OpenAiModule } from './openai/openai.module';
import { InsuranceModule } from './insurance/insurance.module';
import { PassportModule } from './passport/passport.module';
import { DriverLicenseModule } from './driver-license/driver-license.module';
import { OpenaiPromtsModule } from './openai-promts/openai-promts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegramModule,
    FetchModule,
    MindeeModule,
    BotModule,
    UsersModule,
    PhotoModule,
    DocumentsModule,
    OpenAiModule,
    InsuranceModule,
    PassportModule,
    DriverLicenseModule,
    OpenaiPromtsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

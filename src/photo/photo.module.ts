import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UsersModule } from 'src/users/users.module';
import { DocumentsModule } from 'src/documents/documents.module';
import { OpenAiModule } from 'src/openai/openai.module';
import { InsuranceModule } from 'src/insurance/insurance.module';

@Module({
  imports: [
    TelegramModule,
    UsersModule,
    DocumentsModule,
    OpenAiModule,
    InsuranceModule,
  ],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotoModule {}

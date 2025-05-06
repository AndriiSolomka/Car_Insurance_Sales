import { Module } from '@nestjs/common';
import { PhotoExtractionService } from './photo-extraction.service';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UsersModule } from 'src/users/users.module';
import { DocumentsModule } from 'src/documents/documents.module';
import { OpenAiModule } from 'src/openai/openai.module';
import { InsuranceModule } from 'src/insurance/insurance.module';
import { PhotoUploadHandler } from './photo-upload.service';
import { UserPhotoService } from './user-photo.service';

@Module({
  imports: [
    TelegramModule,
    UsersModule,
    DocumentsModule,
    OpenAiModule,
    InsuranceModule,
    OpenAiModule,
  ],
  providers: [PhotoExtractionService, PhotoUploadHandler, UserPhotoService],
  exports: [PhotoUploadHandler],
})
export class PhotoModule {}

import { Module } from '@nestjs/common';
import { PhotoExtractionService } from './photo-extraction.service';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UsersModule } from 'src/users/users.module';
import { DocumentsModule } from 'src/documents/documents.module';
import { InsuranceModule } from 'src/insurance/insurance.module';
import { PhotoUploadHandler } from './photo-upload.service';
import { UserPhotoService } from './user-photo.service';
import { OpenaiPromptsModule } from 'src/openai-prompts/openai-prompts.module';

@Module({
  imports: [
    TelegramModule,
    UsersModule,
    DocumentsModule,
    InsuranceModule,
    OpenaiPromptsModule,
  ],
  providers: [PhotoExtractionService, PhotoUploadHandler, UserPhotoService],
  exports: [PhotoUploadHandler],
})
export class PhotoModule {}

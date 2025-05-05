import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { TelegramModule } from 'src/telegram/telegram.module';
import { UsersModule } from 'src/users/users.module';
import { DocumentsModule } from 'src/documents/documents.module';

@Module({
  imports: [TelegramModule, UsersModule, DocumentsModule],
  providers: [PhotoService],
  exports: [PhotoService],
})
export class PhotoModule {}

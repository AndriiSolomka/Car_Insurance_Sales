import { Module } from '@nestjs/common';
import { OpenaiPromtsService } from './openai-promts.service';

@Module({
  providers: [OpenaiPromtsService]
})
export class OpenaiPromtsModule {}

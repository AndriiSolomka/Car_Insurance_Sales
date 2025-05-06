import { Module } from '@nestjs/common';
import { OpenaiPromptsService } from './openai-prompts.service';
import { OpenAiModule } from 'src/openai/openai.module';

@Module({
  imports: [OpenAiModule],
  providers: [OpenaiPromptsService],
  exports: [OpenaiPromptsService],
})
export class OpenaiPromptsModule {}

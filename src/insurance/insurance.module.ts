import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { OpenAiModule } from 'src/openai/openai.module';
import { ConfirmationService } from './confirmation.service';
import { OpenaiPromptsModule } from 'src/openai-prompts/openai-prompts.module';

@Module({
  imports: [OpenAiModule, OpenaiPromptsModule],
  providers: [InsuranceService, ConfirmationService],
  exports: [InsuranceService, ConfirmationService],
})
export class InsuranceModule {}

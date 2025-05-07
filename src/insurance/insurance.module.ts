import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { OpenaiPromptsModule } from 'src/openai-prompts/openai-prompts.module';

@Module({
  imports: [OpenaiPromptsModule],
  providers: [InsuranceService],
  exports: [InsuranceService],
})
export class InsuranceModule {}

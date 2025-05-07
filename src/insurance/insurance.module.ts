import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { OpenaiPromptsModule } from 'src/openai-prompts/openai-prompts.module';
import { PdfModule } from 'src/pdf/pdf.module';

@Module({
  imports: [OpenaiPromptsModule, PdfModule],
  providers: [InsuranceService],
  exports: [InsuranceService],
})
export class InsuranceModule {}

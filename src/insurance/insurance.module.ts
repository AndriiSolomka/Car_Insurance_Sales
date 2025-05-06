import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { OpenAiModule } from 'src/openai/openai.module';
import { ConfirmationService } from './confirmation.service';

@Module({
  imports: [OpenAiModule],
  providers: [InsuranceService, ConfirmationService],
  exports: [InsuranceService, ConfirmationService],
})
export class InsuranceModule {}

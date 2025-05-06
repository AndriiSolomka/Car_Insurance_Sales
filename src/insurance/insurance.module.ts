import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { OpenAiModule } from 'src/openai/openai.module';

@Module({
  imports: [OpenAiModule],
  providers: [InsuranceService],
  exports: [InsuranceService],
})
export class InsuranceModule {}

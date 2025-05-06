// services/insurance.service.ts
import { Injectable } from '@nestjs/common';
import { OpenAiService } from 'src/openai/openai.service';
import { IPassportData } from 'src/constants/telegram/types/filterDocument.interface';
import { generatePolicyPrompt } from 'src/utils/promt/insurance';

@Injectable()
export class InsuranceService {
  constructor(private readonly openAiService: OpenAiService) {}

  async generatePolicy(passportData: IPassportData): Promise<string> {
    const prompt = generatePolicyPrompt(passportData);
    return await this.openAiService.ask(prompt);
  }
}

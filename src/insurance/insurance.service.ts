import { Injectable } from '@nestjs/common';
import { IPassportData } from 'src/constants/telegram/types/filterDocument.interface';
import { generatePolicyPrompt } from 'src/utils/promt/insurance';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';

@Injectable()
export class InsuranceService {
  constructor(private readonly aiService: OpenaiPromptsService) {}

  async generatePolicy(passportData: IPassportData): Promise<string> {
    const prompt = generatePolicyPrompt(passportData);
    return await this.aiService.askCustomPrompt(prompt);
  }
}

import { Injectable } from '@nestjs/common';
import { IPassportData } from 'src/constants/telegram/types/filterDocument.interface';
import { generatePolicyPrompt } from 'src/utils/promt/insurance';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';
import { Context } from 'telegraf';

@Injectable()
export class InsuranceService {
  constructor(private readonly aiService: OpenaiPromptsService) {}

  async generatePolicy(passportData: IPassportData): Promise<string> {
    const prompt = generatePolicyPrompt(passportData);
    return await this.aiService.askCustomPrompt(prompt);
  }

  async sendPolice(ctx: Context, passportData: any) {
    console.log('passportData', passportData);
  }
}

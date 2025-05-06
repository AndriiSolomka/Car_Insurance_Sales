import { Injectable } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { IPassportData } from 'src/constants/telegram/types/filterDocument.interface';
import { Context } from 'telegraf';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';
import { OpenAiPromptsStatus } from 'src/constants/openai/prompts';

@Injectable()
export class ConfirmationService {
  constructor(
    private readonly insuranceService: InsuranceService,
    private readonly aiService: OpenaiPromptsService,
  ) {}

  async sendConfirmation(ctx: Context, passportData: IPassportData) {
    const aiResponse = await this.aiService.askPrompt(
      OpenAiPromptsStatus.CONFIRMATION,
    );
    await ctx.reply(aiResponse);

    const policyText = await this.insuranceService.generatePolicy(passportData);
    await ctx.reply(policyText);
  }
}

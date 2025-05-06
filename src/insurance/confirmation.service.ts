import { Injectable } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { IPassportData } from 'constants/telegram/types/filterDocument.interface';
import { Context } from 'telegraf';
import { OpenAiService } from 'src/openai/openai.service';
import { OpenAiPrompts } from 'constants/openai/promts';

@Injectable()
export class ConfirmationService {
  constructor(
    private readonly insuranceService: InsuranceService,
    private readonly openAiService: OpenAiService,
  ) {}

  async sendConfirmation(ctx: Context, passportData: IPassportData) {
    const prompt = OpenAiPrompts.CONFIRMATION;
    const aiResponse = await this.openAiService.ask(prompt);
    await ctx.reply(aiResponse);
    const policyText = this.insuranceService.generatePolicy(passportData);
    await ctx.reply(policyText);
  }
}

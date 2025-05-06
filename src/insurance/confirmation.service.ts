import { Injectable } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { Context } from 'telegraf';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';

@Injectable()
export class ConfirmationService {
  constructor(
    private readonly insuranceService: InsuranceService,
    private readonly aiService: OpenaiPromptsService,
  ) {}

  async sendConfirmation(ctx: Context, passportData: any) {
    console.log('passportData', passportData);

    // const policyText = await this.insuranceService.generatePolicy(passportData);
    // await ctx.reply(policyText);
  }
}

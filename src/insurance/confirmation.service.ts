import { Injectable } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { IPassportData } from 'constants/telegram/types/filterDocument.interface';
import { BotMessages } from 'constants/telegram/enums/bot-messages.enum';
import { Context } from 'telegraf';

@Injectable()
export class ConfirmationService {
  constructor(private readonly insuranceService: InsuranceService) {}

  async sendConfirmation(ctx: Context, passportData: IPassportData) {
    await ctx.reply(
      `${BotMessages.DOCUMENTS_RECEIVED}\n${JSON.stringify(
        passportData,
        null,
        2,
      )}`,
    );

    const policyText = this.insuranceService.generatePolicy(passportData);
    await ctx.reply(policyText);
  }
}

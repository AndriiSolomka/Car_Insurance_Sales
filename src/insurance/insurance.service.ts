import { Injectable } from '@nestjs/common';
import { IPassportData } from 'src/constants/telegram/types/filterDocument.interface';
import { generatePolicyPrompt } from 'src/utils/promt/insurance';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';
import { Context } from 'telegraf';
import { PdfService } from 'src/pdf/pdf.service'; // ⬅️ импортируй PdfService
import { getPolicyDates } from 'src/utils/date/date';

@Injectable()
export class InsuranceService {
  constructor(
    private readonly aiService: OpenaiPromptsService,
    private readonly pdfService: PdfService,
  ) {}

  async generatePolicy(passportData: any): Promise<Buffer> {
    const { issueDate, expiryDate } = getPolicyDates();

    const prompt = generatePolicyPrompt(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      passportData.passport,
      issueDate,
      expiryDate,
    );
    const text = await this.aiService.askCustomPrompt(prompt);
    return await this.pdfService.generatePdf(text);
  }

  async sendPolice(ctx: Context, passportData: IPassportData) {
    const pdfBuffer = await this.generatePolicy(passportData);
    return await ctx.replyWithDocument({
      source: pdfBuffer,
      filename: 'insurance_policy.pdf',
    });
  }
}

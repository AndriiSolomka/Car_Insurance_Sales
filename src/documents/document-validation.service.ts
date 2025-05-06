import { Injectable } from '@nestjs/common';
import { DocumentsService } from './document.service';
import { UsersService } from 'src/users/users.service';
import { Context } from 'telegraf';
import { OpenAiPrompts } from 'src/constants/openai/promts';
import { OpenAiService } from 'src/openai/openai.service';

@Injectable()
export class DocumentValidationService {
  constructor(
    private readonly documentService: DocumentsService,
    private readonly userService: UsersService,
    private readonly openAiService: OpenAiService,
  ) {}

  async validatePhotos(ctx: Context, userId: string, photos: Buffer[]) {
    const validation = await this.documentService.validate(photos);

    if (!validation) {
      this.userService.clearPhotos(userId);

      const prompt = OpenAiPrompts.INVALID_PASSPORT_DATA;
      const aiResponse = await this.openAiService.ask(prompt);

      await ctx.reply(aiResponse);
      return null;
    }

    return validation;
  }
}

import { Injectable } from '@nestjs/common';
import { DocumentsService } from './document.service';
import { UsersService } from 'src/users/users.service';
import { Context } from 'telegraf';
import { OpenAiPromptsStatus } from 'src/constants/openai/prompts';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';

@Injectable()
export class DocumentValidationService {
  constructor(
    private readonly documentService: DocumentsService,
    private readonly userService: UsersService,
    private readonly aiService: OpenaiPromptsService,
  ) {}

  async validatePhotos(ctx: Context, userId: string, photos: Buffer[]) {
    const validation = await this.documentService.validate(photos);

    if (!validation) {
      this.userService.clearPhotos(userId);
      const aiResponse = await this.aiService.askPrompt(
        OpenAiPromptsStatus.INVALID_PASSPORT_DATA,
      );
      await ctx.reply(aiResponse);
      return null;
    }

    return validation;
  }
}

import { Injectable } from '@nestjs/common';
import { OpenAiPromptsStatus } from 'src/constants/openai/prompts';
import { REQUIRED_PHOTO_COUNT } from 'src/constants/telegram/enums/photo';
import { OpenaiPromptsService } from 'src/openai-prompts/openai-prompts.service';

@Injectable()
export class PhotoCountValidatorService {
  constructor(private readonly aiService: OpenaiPromptsService) {}

  async validate(photoCount: number): Promise<string | null> {
    if (photoCount > +REQUIRED_PHOTO_COUNT.COUNT) {
      return this.aiService.askPrompt(
        OpenAiPromptsStatus.DOCUMENT_UPLOAD_TOO_MANY,
      );
    }
    if (photoCount < +REQUIRED_PHOTO_COUNT.COUNT) {
      return this.aiService.askPrompt(
        OpenAiPromptsStatus.DOCUMENT_UPLOAD_INSUFFICIENT,
      );
    }
    return null;
  }
}

import { Injectable } from '@nestjs/common';
import { OpenAiPrompts } from 'src/constants/openai/prompts';
import { OpenAiService } from 'src/openai/openai.service';

@Injectable()
export class OpenaiPromptsService {
  constructor(private readonly openAiService: OpenAiService) {}

  async askPrompt(key: keyof typeof OpenAiPrompts): Promise<string> {
    try {
      const prompt = OpenAiPrompts[key];
      const response = await this.openAiService.ask(prompt);
      return response || OpenAiPrompts.ERROR;
    } catch (error) {
      console.error(`OpenAI error on prompt [${key}]:`, error);
      return OpenAiPrompts.ERROR;
    }
  }

  async askCustomPrompt(prompt: string): Promise<string> {
    try {
      const response = await this.openAiService.ask(prompt);
      return response || OpenAiPrompts.ERROR;
    } catch (error) {
      console.error(`OpenAI error on custom prompt:`, error);
      return OpenAiPrompts.ERROR;
    }
  }
}

import { UserAnswers } from 'src/constants/telegram/enums/user-answers.enum';
import { Context } from 'telegraf';

export const isPositiveAnswer = (ctx: Context): boolean => {
  const text = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
  if (!text) return false;
  const normalized = text.toLowerCase();
  return Object.values(UserAnswers).some((word) => normalized.includes(word));
};

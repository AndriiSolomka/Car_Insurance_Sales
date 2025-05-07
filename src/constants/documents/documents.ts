import { IPassportData } from '../telegram/types/filterDocument.interface';

export const DOCUMENTS_MESSAGES = {
  EXTRACTED_DATA: (passport: IPassportData, license: any) =>
    `Ось які дані нам вдалося розпізнати:\n\n` +
    `📘 Паспорт:\n${JSON.stringify(passport, null, 2)}\n\n` +
    `🚘 Водійське посвідчення:\n${JSON.stringify(license, null, 2)}`,

  CONFIRMATION_PROMPT:
    `\n\n✅ Будь ласка, перевірте, чи всі дані вірні.\n` +
    `Якщо все вказано правильно — підтвердіть, і ми перейдемо до наступного кроку.\n` +
    `Якщо є помилка — ви зможете повторити завантаження.`,
};

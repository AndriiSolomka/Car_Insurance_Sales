export enum BotMessages {
  WELCOME = '👋 Привіт! Я допоможу вам оформити автострахування. Будь ласка, надішліть фото паспорта та техпаспорта.',
  INVALID_STATE_FOR_PHOTO = '⚠️ Зараз не очікую фото. Будь ласка, дотримуйтесь інструкцій.',
  ERROR_WITH_HANDLE_PHOTO = '❌ Сталася помилка під час обробки фото.',
  INVALID_PASSPORT_DATA = '🚫 Не вдалося зчитати дані. Спробуйте ще раз.',
  PRICE_OFFER = '💵 Вартість автострахування складає 100 USD. Ви згодні?',
  ONLY_ONE_PRICE = '😔 Вибачте, наразі ціна є фіксованою — 100 USD.',
  CONFIRMED = '✅ Дякуємо! Ваше замовлення прийняте.',
  DOCUMENTS_RECEIVED = '📄 Ми зчитали такі дані:',
}

export const photoProgressMessage = (
  current: number,
  required: number,
): string =>
  `🖼 Фото отримано (${current}/${required}). Будь ласка, надішліть ще.`;

import { IPassportData } from 'src/constants/telegram/types/filterDocument.interface';

export const generatePolicyPrompt = (data: IPassportData): string => {
  return `
  Сгенерируй страховой полис на автомобиль, используя следующие данные клиента:
  
  Фамилия: ${data.surname}
  Имя: ${data.givenName}
  Пол: ${data.gender}
  Дата рождения: ${data.dateOfBirth}
  Номер паспорта: ${data.passportNumber}
  Код страны: ${data.countryCode}
  Дата выдачи паспорта: ${data.dateOfIssue}
  Срок действия паспорта: ${data.expiryDate}
  Место рождения: ${data.placeOfBirth}
  
  Цена полиса: 100 долларов США.
  
  
  Сформируй короткий, официально звучащий документ на русском языке, включая имя клиента, паспортные данные, сумму, дату, и заверши подписью и номером договора.
    `;
};

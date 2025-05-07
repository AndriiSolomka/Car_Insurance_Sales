import { IPassportData } from 'src/constants/telegram/types/filterDocument.interface';

export const filterPassportData = (rawData: string): IPassportData => {
  const extract = (label: string): string => {
    const regex = new RegExp(`:${label}: (.+)`);
    const match = rawData.match(regex);
    return match ? match[1].trim() : 'N/A';
  };

  return {
    surname: extract('Surname'),
    givenName: extract('Given Name\\(s\\)'),
    gender: extract('Gender'),
    dateOfBirth: extract('Date of Birth'),
    passportNumber: extract('ID Number'),
    countryCode: extract('Country Code'),
    dateOfIssue: extract('Date of Issue'),
    expiryDate: extract('Expiry Date'),
    placeOfBirth: extract('Place of Birth'),
  };
};

export const checkPassportData = (data: IPassportData): boolean => {
  for (const item in data) {
    if (data[item] === 'N/A') return false;
  }
  return true;
};

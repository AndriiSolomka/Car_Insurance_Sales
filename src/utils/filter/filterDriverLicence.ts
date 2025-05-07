import { IDriverLicenseData } from 'src/constants/telegram/types/filterDocument.interface';

export const filterDriverLicenseData = (
  rawData: string,
): IDriverLicenseData => {
  const extract = (label: string): string => {
    const regex = new RegExp(`:${label}: (.+)`);
    const match = rawData.match(regex);
    return match ? match[1].trim() : 'N/A';
  };

  return {
    surname: extract('Surname'),
    givenName: extract('Given Name\\(s\\)'),
    dateOfBirth: extract('Date of Birth'),
    issueDate: extract('Date of Issue'),
    expiryDate: extract('Expiry Date'),
    placeOfBirth: extract('Place of Birth'),
    issuingAuthority: extract('Place of Birth'),
    licenseNumber: extract('Place of Birth'),
  };
};

export const checkDriverLicenseData = (data: IDriverLicenseData): boolean => {
  for (const item in data) {
    if (data[item] === 'N/A') return false;
  }
  return true;
};

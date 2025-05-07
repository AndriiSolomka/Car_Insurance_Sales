import { IPassportData } from 'src/constants/telegram/types/filterDocument.interface';

export const generatePolicyPrompt = (
  data: IPassportData,
  issueDate: string,
  expiryDate: string,
): string => {
  return `
Please generate a car insurance policy using the following client information:

Last Name: ${data.surname}
First Name: ${data.givenName}
Gender: ${data.gender}
Date of Birth: ${data.dateOfBirth}
Passport Number: ${data.passportNumber}
Country Code: ${data.countryCode}
Passport Issue Date: ${data.dateOfIssue}
Passport Expiry Date: ${data.expiryDate}
Place of Birth: ${data.placeOfBirth}

Policy Price: 100 USD
Policy Issue Date: ${issueDate}
Policy Expiry Date: ${expiryDate}

Create a short, official-sounding document, including the client's full name, passport details, policy price, issue date (today), and an expiration date exactly one year later. Also end the document with a placeholder for a signature.
`;
};

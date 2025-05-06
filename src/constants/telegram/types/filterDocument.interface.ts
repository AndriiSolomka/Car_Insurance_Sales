export interface IPassportData {
  surname: string;
  givenName: string;
  gender: string;
  dateOfBirth: string;
  passportNumber: string;
  countryCode: string;
  dateOfIssue: string;
  expiryDate: string;
  placeOfBirth: string;
}

export interface IDriverLicenseData {
  surname: string;
  givenName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  licenseNumber: string;
}

import { Injectable } from '@nestjs/common';
import { PassportService } from './passport.service';
import { DriverLicenseService } from './driver-license.service';

@Injectable()
export class DocumentValidatorService {
  constructor(
    private readonly passportService: PassportService,
    private readonly driverLicenseService: DriverLicenseService,
  ) {}

  async validate(photos: Buffer[]) {
    const [licensePhoto, passportPhoto] = photos;

    const { valid: licenseValid, data: licenseData } =
      await this.passportService.validatePassport(passportPhoto);

    const { valid: passportValid, data: passportData } =
      await this.passportService.validatePassport(passportPhoto);

    if (!licenseValid || !passportValid) return null;

    return {
      licenseData,
      passportData,
    };
  }
}

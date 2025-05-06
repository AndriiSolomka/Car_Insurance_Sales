import { Injectable } from '@nestjs/common';
import { DriverLicenseService } from 'src/driver-license/driver-license.service';
import { PassportService } from 'src/passport/passport.service';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly passportService: PassportService,
    private readonly driverLicenseService: DriverLicenseService,
  ) {}

  async validate(photos: Buffer[]) {
    const [licensePhoto, passportPhoto] = photos;

    const passport2 =
      await this.passportService.validatePassport(passportPhoto);

    const passport1 =
      await this.passportService.validatePassport(passportPhoto);

    if (!passport1 || !passport2) return null;

    return {
      passport2,
      passport1,
    };
  }
}

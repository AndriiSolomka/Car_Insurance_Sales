import { Injectable } from '@nestjs/common';
import { DOCUMENTS_MESSAGES } from 'src/constants/documents/documents';
import { REQUIRED_PHOTO_COUNT } from 'src/constants/telegram/enums/photo';
import { StateStatuses } from 'src/constants/telegram/enums/state-status.enum';
import { DriverLicenseService } from 'src/driver-license/driver-license.service';
import { PassportService } from 'src/passport/passport.service';
import { UsersService } from 'src/users/users.service';
import { Context } from 'telegraf';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly passportService: PassportService,
    private readonly driverLicenseService: DriverLicenseService,
    private readonly userService: UsersService,
  ) {}

  async validate(photos: Buffer[]) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [licensePhoto, passportPhoto] = photos;

    const license = await this.passportService.validatePassport(passportPhoto);
    const passport = await this.passportService.validatePassport(passportPhoto);

    if (!license || !passport) return null;

    return {
      passport,
      license,
    };
  }

  async requestDataConfirmation(
    ctx: Context,
    userId: string,
    userPhotos: Buffer[],
    passportData: any,
  ) {
    const isComplete = userPhotos.length === +REQUIRED_PHOTO_COUNT.COUNT;

    if (isComplete) {
      this.userService.setState(
        userId,
        StateStatuses.WAITING_FOR_DATA_CONFIRMATION,
      );

      const extractedDataMsg = DOCUMENTS_MESSAGES.EXTRACTED_DATA(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        passportData.passport,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        passportData.license,
      );

      return ctx.reply(
        `${extractedDataMsg}${DOCUMENTS_MESSAGES.CONFIRMATION_PROMPT}`,
      );
    }
  }
}

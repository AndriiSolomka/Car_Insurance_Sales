import { Module } from '@nestjs/common';
import { PassportService } from './passport.service';
import { MindeeModule } from 'src/mindee/mindee.module';
import { DriverLicenseService } from './driver-license.service';
import { DocumentValidatorService } from './validator.service';

@Module({
  imports: [MindeeModule],
  providers: [PassportService, DriverLicenseService, DocumentValidatorService],
  exports: [PassportService, DriverLicenseService, DocumentValidatorService],
})
export class DocumentsModule {}

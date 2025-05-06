import { Module } from '@nestjs/common';
import { DocumentsService } from './document.service';
import { PassportModule } from 'src/passport/passport.module';
import { DriverLicenseModule } from 'src/driver-license/driver-license.module';
import { DocumentValidationService } from './document-validation.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PassportModule, DriverLicenseModule, UsersModule],
  providers: [DocumentsService, DocumentValidationService],
  exports: [DocumentsService, DocumentValidationService],
})
export class DocumentsModule {}

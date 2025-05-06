import { Module } from '@nestjs/common';
import { DocumentsService } from './document.service';
import { PassportModule } from 'src/passport/passport.module';
import { DriverLicenseModule } from 'src/driver-license/driver-license.module';

@Module({
  imports: [PassportModule, DriverLicenseModule],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}

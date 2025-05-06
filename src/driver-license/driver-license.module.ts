import { Module } from '@nestjs/common';
import { DriverLicenseService } from './driver-license.service';
import { MindeeModule } from 'src/mindee/mindee.module';

@Module({
  imports: [MindeeModule],
  providers: [DriverLicenseService],
  exports: [DriverLicenseService],
})
export class DriverLicenseModule {}

import { Module } from '@nestjs/common';
import { PassportService } from './passport.service';
import { MindeeModule } from 'src/mindee/mindee.module';

@Module({
  imports: [MindeeModule],
  providers: [PassportService],
  exports: [PassportService],
})
export class PassportModule {}

import { Module } from '@nestjs/common';
import { MindeeService } from './mindee.service';
import { FetchModule } from 'src/fetch/fetch.module';

@Module({
  imports: [FetchModule],
  providers: [MindeeService],
  exports: [MindeeService],
})
export class MindeeModule {}

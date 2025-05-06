import { Injectable } from '@nestjs/common';
import { IPassportData } from 'constants/telegram/types/filterDocument.interface';
import { MindeeService } from 'src/mindee/mindee.service';
import {
  checkPassportData,
  filterPassportData,
} from 'src/utils/filter/filterPassport';

@Injectable()
export class PassportService {
  constructor(private readonly mindee: MindeeService) {}

  async validatePassport(
    buffer: ArrayBuffer,
  ): Promise<{ valid: boolean; data: IPassportData }> {
    const response = await this.mindee.getPassportInfo(buffer);
    const filtered = filterPassportData(response);
    return { valid: checkPassportData(filtered), data: filtered };
  }
}

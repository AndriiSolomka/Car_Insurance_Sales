import { Injectable } from '@nestjs/common';
import { IPassportData } from 'src/constants/telegram/types/filterDocument.interface';
import { MindeeService } from 'src/mindee/mindee.service';
import {
  checkPassportData,
  filterPassportData,
} from 'src/utils/filter/filterPassport';

@Injectable()
export class PassportService {
  constructor(private readonly mindee: MindeeService) {}

  async validatePassport(buffer: ArrayBuffer): Promise<null | IPassportData> {
    const response = await this.mindee.getPassportInfo(buffer);
    const filtered = filterPassportData(response);
    return checkPassportData(filtered) ? filtered : null;
  }
}

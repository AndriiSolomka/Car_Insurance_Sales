import { Injectable } from '@nestjs/common';
import { IPassportData } from 'src/constants/telegram/types/filterDocument.interface';
import { MindeeService } from 'src/mindee/mindee.service';
import {
  checkPassportData,
  filterPassportData,
} from 'src/utils/filter/filterPassport';

@Injectable()
export class DriverLicenseService {
  constructor(private readonly mindee: MindeeService) {}

  async validateDriverLicense(
    buffer: ArrayBuffer,
  ): Promise<{ valid: boolean; data: IPassportData }> {
    const response = await this.mindee.getDriverLicenseInfo(buffer);
    const filtered = filterPassportData(response);
    return { valid: checkPassportData(filtered), data: filtered };
  }
}

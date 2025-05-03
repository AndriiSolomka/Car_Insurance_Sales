import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';
import { FetchService } from 'src/fetch/fetch.service';

@Injectable()
export class MindeeService {
  constructor(
    private readonly config: ConfigService,
    private readonly axios: FetchService,
  ) {}

  async getPassportInfo(imagePath: string): Promise<any> {
    const apiKey = this.config.get<string>('MINDEE_API_KEY');
    const url = this.config.get<string>('MINDEE_PASPORT_URL') as string;

    const form = new FormData();
    form.append('document', createReadStream(imagePath));

    const headers = {
      ...form.getHeaders(),
      Authorization: `Token ${apiKey}`,
    };

    // return await this.axios.post<any>(url, {
    //   method: 'POST',
    //   headers,
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //   body: form as any,
    // });
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mindee from 'mindee';
import { Readable } from 'stream';

@Injectable()
export class MindeeService {
  private readonly client: mindee.Client;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('MINDEE_API_KEY');
    this.client = new mindee.Client({ apiKey });
  }

  async getPassportInfo(buffer: ArrayBuffer): Promise<string> {
    const stream = Readable.from(Buffer.from(buffer));
    const inputSource = this.client.docFromStream(stream, 'passport.jpg');

    const response = await this.client.parse(
      mindee.product.PassportV1,
      inputSource,
    );

    return response.document.toString();
  }
}

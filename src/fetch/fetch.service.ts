import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class FetchService {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      const message = await response.text();
      throw new HttpException(
        `Request to ${url} failed: ${message}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }

    if (contentType && contentType.includes('text')) {
      return (await response.text()) as unknown as T;
    }

    if (contentType && contentType.includes('application/octet-stream')) {
      return (await response.arrayBuffer()) as unknown as T;
    }

    return (await response.text()) as unknown as T;
  }
}

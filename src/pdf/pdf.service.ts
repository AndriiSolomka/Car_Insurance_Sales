import { Injectable } from '@nestjs/common';
import * as streamBuffers from 'stream-buffers';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  generatePdf(text: string): Promise<Buffer> {
    const doc = new PDFDocument();
    const stream = new streamBuffers.WritableStreamBuffer();

    doc.pipe(stream);
    doc.font('Times-Roman').fontSize(12).text(text, {
      align: 'left',
    });
    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        const buffer = stream.getContents();
        if (buffer) {
          resolve(buffer);
        } else {
          reject(new Error('Failed to generate PDF buffer'));
        }
      });
      stream.on('error', reject);
    });
  }
}

import { Injectable } from '@nestjs/common';
import * as ImageThumbnail from 'image-thumbnail';
import { fromBuffer, fromStream } from 'file-type';
import got from 'got';

@Injectable()
export class ThumbnailService {
  async createFromBuffer(
    src: Buffer,
  ): Promise<{ thumbnail?: Buffer; ext?: string; mime?: string; err?: any }> {
    try {
      const { ext, mime } = await fromBuffer(src);
      const thumbnail = await ImageThumbnail(src, {
        responseType: 'buffer',
      });
      return { thumbnail, ext, mime };
    } catch (err) {
      return { err: err };
    }
  }

  async createFromUrl(src: string) {
    try {
      const stream = got.stream(src);
      const { ext, mime } = await fromStream(stream);
      const thumbnail = await ImageThumbnail(
        { uri: src },
        {
          responseType: 'buffer',
        },
      );
      return { thumbnail, ext, mime };
    } catch (err) {
      return { err };
    }
  }
}

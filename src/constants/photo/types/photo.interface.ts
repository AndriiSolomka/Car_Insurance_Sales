import { Context } from 'telegraf';

export interface PhotoUploadData {
  ctx: Context;
  userId: string;
  userPhotos: Buffer[];
}

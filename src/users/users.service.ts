import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

@Injectable()
export class UsersService {
  private state = new Map<string, string>();
  private photos = new Map<string, Buffer[]>();

  getState(userId: string): string | undefined {
    return this.state.get(userId);
  }

  setState(userId: string, status: string) {
    this.state.set(userId, status);
  }

  addPhotos(userId: string, newPhotos: Buffer[]) {
    const existing = this.photos.get(userId) ?? [];
    this.photos.set(userId, [...existing, ...newPhotos]);
  }

  getPhotos(userId: string): Buffer[] {
    return this.photos.get(userId) ?? [];
  }

  clearPhotos(userId: string) {
    this.photos.delete(userId);
  }

  getUserId(ctx: Context): string {
    return ctx.chat?.id?.toString() ?? 'unknown_user';
  }
}

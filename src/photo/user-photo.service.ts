import { Injectable } from '@nestjs/common';
import { REQUIRED_PHOTO_COUNT } from 'constants/telegram/enums/photo';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserPhotoService {
  private readonly REQUIRED_PHOTO_COUNT = Number(REQUIRED_PHOTO_COUNT.COUNT);

  constructor(private readonly userService: UsersService) {}

  addPhotos(userId: string, photos: Buffer[]): void {
    this.userService.addPhotos(userId, photos);
  }

  getPhotos(userId: string): Buffer[] {
    return this.userService.getPhotos(userId);
  }

  isPhotoCountSufficient(userPhotos: Buffer[]): boolean {
    return userPhotos.length === this.REQUIRED_PHOTO_COUNT;
  }

  clearPhotos(userId: string): void {
    this.userService.clearPhotos(userId);
  }
}

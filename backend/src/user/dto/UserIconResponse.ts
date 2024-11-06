import { User } from '../entity/user.entity';

export const DEFAULT_PROFILE_IMAGE_URL =
  'https://avatars.githubusercontent.com/u/87180146?v=4';

export class UserIconResponse {
  constructor(
    readonly id: number,
    readonly nickname: string,
    readonly profileImageUrl: string,
  ) {}

  static from(user: User) {
    return new UserIconResponse(
      user.id,
      user.nickname,
      user.profileImageUrl ?? DEFAULT_PROFILE_IMAGE_URL,
    );
  }
}

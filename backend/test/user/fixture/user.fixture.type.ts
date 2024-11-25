import { UserRole } from '@src/user/user.role';

export type UserFixtureType = {
  provider?: string;
  nickname?: string;
  oauthId?: string;
  role?: UserRole;
  profileImageUrl?: string;
};

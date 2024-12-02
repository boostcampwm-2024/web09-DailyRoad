import { Role } from '@src/user/enum/Role';

export type UserFixtureType = {
  provider?: string;
  nickname?: string;
  oauthId?: string;
  role?: Role;
  profileImageUrl?: string;
};

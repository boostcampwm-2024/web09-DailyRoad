import { UserRole } from './user.role';

export type UserInfoWithProvider = {
  provider: string;
  nickname: string;
  oauthId: string;
  role: UserRole;
  profileImageUrl: string;
};

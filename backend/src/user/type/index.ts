import { Role } from '../enum/Role';

export type UserInfoWithProvider = {
  provider: string;
  nickname: string;
  oauthId: string;
  role: Role;
  profileImageUrl: string;
};

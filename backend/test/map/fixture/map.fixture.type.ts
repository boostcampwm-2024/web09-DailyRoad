import { User } from '@src/user/entity/User';

export type MapFixtureType = {
  user: User;
  title?: string;
  isPublic?: boolean;
  thumbnailUrl?: string;
  description?: string;
};

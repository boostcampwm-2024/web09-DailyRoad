import { User } from '@src/user/entity/user.entity';

export type MapFixtureType = {
  user: User;
  title?: string;
  isPublic?: boolean;
  thumbnailUrl?: string;
  description?: string;
};

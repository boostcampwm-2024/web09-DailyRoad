import { User } from '@src/user/entity/user.entity';

export type CourseFixtureType = {
  user?: User;
  title?: string;
  isPublic?: boolean;
  thumbnailUrl?: string;
  description?: string;
};

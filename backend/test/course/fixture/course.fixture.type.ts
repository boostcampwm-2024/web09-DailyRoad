import { User } from '@src/user/entity/User';

export type CourseFixtureType = {
  user?: User;
  title?: string;
  isPublic?: boolean;
  thumbnailUrl?: string;
  description?: string;
};

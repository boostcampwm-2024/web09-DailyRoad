import { Course } from '../../../src/course/entity/course.entity';
import { CourseFixtureType } from './course.fixture.type';

export class CourseFixture {
  static createCourse = ({
    user,
    title = 'My Course',
    isPublic = true,
    thumbnailUrl = 'https://example.com/course_thumbnail.jpg',
    description = 'A sample course with popular places',
  }: CourseFixtureType) => {
    return new Course(user, title, isPublic, thumbnailUrl, description);
  };
}

import { User } from '../../user/entity/user.entity';
import { IsString, IsNotEmpty, IsUrl, IsBoolean } from 'class-validator';
import { Course } from '../entity/course.entity';

export class CreateCourseRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @IsString()
  description?: string;

  @IsUrl()
  thumbnailUrl?: string;

  static from({ title, isPublic, description, thumbnailUrl }) {
    const request = new CreateCourseRequest();
    request.title = title;
    request.isPublic = isPublic;
    request.description = description;
    request.thumbnailUrl = thumbnailUrl;

    return request;
  }

  toEntity(user: User) {
    return new Course(
      user,
      this.title,
      this.isPublic,
      this.thumbnailUrl,
      this.description,
    );
  }
}

import { User } from '../../user/entity/user.entity';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
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

  @ValidateIf((object, value) => value !== '')
  @IsUrl()
  thumbnailUrl?: string;

  static from({ title, isPublic, description, thumbnailUrl }) {
    const request = new CreateCourseRequest();
    request.title = title;
    request.isPublic = isPublic;
    request.description = description;
    request.thumbnailUrl = thumbnailUrl || Course.DEFAULT_THUMBNAIL_URL;
    return request;
  }

  toEntity(user: User) {
    return new Course(
      user,
      this.title,
      this.isPublic,
      this.thumbnailUrl ? this.thumbnailUrl : Course.DEFAULT_THUMBNAIL_URL,
      this.description,
    );
  }
}

import { User } from '@src/user/entity/user.entity';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { Course } from '../entity/course.entity';
import { ReplaceEmptyWith } from '@src/common/decorator/ReplaceEmptyWith';
import { DEFAULT_THUMBNAIL_URL } from '@src/common/consts';

export class CreateCourseRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @IsString()
  description?: string;

  @ReplaceEmptyWith(DEFAULT_THUMBNAIL_URL)
  @IsOptional()
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

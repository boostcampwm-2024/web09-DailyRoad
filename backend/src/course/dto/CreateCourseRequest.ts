import { User } from '../../user/user.entity';
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
    const form = new CreateCourseRequest();
    form.title = title;
    form.isPublic = isPublic;
    form.description = description;
    form.thumbnailUrl = thumbnailUrl;

    return form;
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

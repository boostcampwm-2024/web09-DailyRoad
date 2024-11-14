import { User } from '../../user/entity/user.entity';
import { Map } from '../entity/map.entity';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsBoolean,
  ValidateIf,
} from 'class-validator';

export class CreateMapRequest {
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
    const request = new CreateMapRequest();
    request.title = title;
    request.isPublic = isPublic;
    request.description = description;
    request.thumbnailUrl = thumbnailUrl ? Map.DEFAULT_THUMBNAIL_URL : '';

    return request;
  }

  toEntity(user: User) {
    return new Map(
      user,
      this.title,
      this.isPublic,
      this.thumbnailUrl ? this.thumbnailUrl : Map.DEFAULT_THUMBNAIL_URL,
      this.description,
    );
  }
}

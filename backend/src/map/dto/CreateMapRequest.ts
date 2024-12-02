import { User } from '../../user/entity/User';
import { Map } from '../entity/Map';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ReplaceEmptyWith } from '@src/common/decorator/ReplaceEmptyWith';
import { DEFAULT_THUMBNAIL_URL } from '@src/common/consts';

export class CreateMapRequest {
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

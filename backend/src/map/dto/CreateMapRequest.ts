import { User } from '../../user/entity/user.entity';
import { Map } from '../entity/map.entity';
import { IsString, IsNotEmpty, IsUrl, IsBoolean } from 'class-validator';

export class CreateMapRequest {
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
    const request = new CreateMapRequest();
    request.title = title;
    request.isPublic = isPublic;
    request.description = description;
    request.thumbnailUrl = thumbnailUrl;

    return request;
  }

  toEntity(user: User) {
    return new Map(
      user,
      this.title,
      this.isPublic,
      this.thumbnailUrl,
      this.description,
    );
  }
}

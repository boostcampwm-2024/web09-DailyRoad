import { User } from '../../user/user.entity';
import { Map } from '../entity/map.entity';
import { IsString, IsNotEmpty, IsUrl, IsBoolean } from 'class-validator';

export class CreateMapForm {
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
    const form = new CreateMapForm();
    form.title = title;
    form.isPublic = isPublic;
    form.description = description;
    form.thumbnailUrl = thumbnailUrl;

    return form;
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

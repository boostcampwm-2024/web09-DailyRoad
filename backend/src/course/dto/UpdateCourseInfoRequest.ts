import { IsString, IsUrl, IsOptional } from 'class-validator';
import { ReplaceEmptyWith } from '@src/common/decorator/ReplaceEmptyWith';
import { DEFAULT_THUMBNAIL_URL } from '@src/common/consts';

export class UpdateCourseInfoRequest {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ReplaceEmptyWith(DEFAULT_THUMBNAIL_URL)
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  isEmpty(): boolean {
    return !this.title && !this.description && !this.thumbnailUrl;
  }
}

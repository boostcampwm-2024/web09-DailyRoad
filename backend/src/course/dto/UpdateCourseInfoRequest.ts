import { IsString, IsUrl, IsOptional } from 'class-validator';

export class UpdateCourseInfoRequest {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  isEmpty(): boolean {
    return !this.title && !this.description && !this.thumbnailUrl;
  }
}

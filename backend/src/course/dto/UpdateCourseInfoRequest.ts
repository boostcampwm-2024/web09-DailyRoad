import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCourseInfoRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description?: string;

  @IsString()
  thumbnailUrl?: string;
}

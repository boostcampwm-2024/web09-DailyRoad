import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCourseInfoRequest {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description?: string;
}

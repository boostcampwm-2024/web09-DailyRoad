import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateCourseVisibilityRequest {
  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;
}

import { IsOptional, IsString } from 'class-validator';

export class UpdatePlaceInCourseRequest {
  @IsOptional()
  @IsString()
  comment?: string;

  isEmpty(): boolean {
    return !this.comment;
  }
}

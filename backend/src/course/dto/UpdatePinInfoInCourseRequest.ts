import { IsOptional, IsString } from 'class-validator';

export class UpdatePinInfoInCourseRequest {
  @IsOptional()
  @IsString()
  comment?: string;

  isEmpty(): boolean {
    return !this.comment;
  }
}

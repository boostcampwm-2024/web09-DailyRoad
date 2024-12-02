import { IsOptional, IsString } from 'class-validator';

export class UpdatePinInCourseRequest {
  @IsOptional()
  @IsString()
  comment?: string;

  isEmpty(): boolean {
    return !this.comment;
  }
}

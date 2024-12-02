import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotConsecutiveDuplicatePlace } from '@src/course/pipes/IsNotConsecutiveDuplicatePlace';

export class UpdatePinsOfCourseRequestItem {
  @IsNumber()
  @IsNotEmpty()
  placeId: number;

  @IsString()
  comment?: string;
}

export class UpdatePinsOfCourseRequest {
  @Validate(IsNotConsecutiveDuplicatePlace)
  @Type(() => UpdatePinsOfCourseRequestItem)
  @IsArray()
  pins: UpdatePinsOfCourseRequestItem[];
}

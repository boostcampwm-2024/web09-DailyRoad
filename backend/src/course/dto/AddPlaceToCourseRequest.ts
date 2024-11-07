import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotConsecutiveDuplicatePlace } from '../pipes/IsNotConsecutiveDuplicatePlace';

export class SetPlacesOfCourseRequestItem {
  @IsNumber()
  @IsNotEmpty()
  placeId: number;

  @IsString()
  comment?: string;
}

export class SetPlacesOfCourseRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetPlacesOfCourseRequestItem)
  @Validate(IsNotConsecutiveDuplicatePlace)
  places: SetPlacesOfCourseRequestItem[];
}

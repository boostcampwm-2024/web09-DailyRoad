import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Color } from '@src/place/place.color.enum';

export class UpdatePlaceInMapRequest {
  @IsOptional()
  @IsEnum(Color)
  color?: Color;

  @IsOptional()
  @IsString()
  comment?: string;

  isEmpty(): boolean {
    return !this.color && !this.comment;
  }
}

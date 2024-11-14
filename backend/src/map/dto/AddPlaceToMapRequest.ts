import { IsNumber, IsString, IsEnum } from 'class-validator';
import { Color } from '../../place/place.color.enum';

export class AddPlaceToMapRequest {
  @IsNumber()
  placeId: number;

  @IsString()
  comment?: string;

  @IsEnum(Color)
  color: Color;
}

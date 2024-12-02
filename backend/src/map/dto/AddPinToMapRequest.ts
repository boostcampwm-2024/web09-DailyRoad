import { IsNumber, IsString, IsEnum } from 'class-validator';
import { Color } from '@src/place/enum/Color';

export class AddPinToMapRequest {
  @IsNumber()
  placeId: number;

  @IsString()
  comment?: string;

  @IsEnum(Color)
  color: Color;

  constructor(placeId: number, comment: string, color: Color) {
    this.placeId = placeId;
    this.comment = comment;
    this.color = color;
  }
}

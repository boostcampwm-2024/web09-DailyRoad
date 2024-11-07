import { IsNumber, IsString } from 'class-validator';

export class AddPlaceToMapRequest {
  @IsNumber()
  placeId: number;

  @IsString()
  comment?: string;
}

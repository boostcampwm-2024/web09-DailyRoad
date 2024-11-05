import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  googlePlaceId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  thumbnailUrl?: string;

  @IsNumber()
  rating?: number;

  @ValidateNested()
  @IsNotEmpty()
  location: {
    longitude: number;
    latitude: number;
  };

  @IsString()
  formattedAddress?: string;

  @IsString()
  description?: string;

  @IsString()
  detailPageUrl?: string;
}

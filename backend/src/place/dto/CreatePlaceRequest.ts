import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Place } from '../place.entity';

export class CreatePlaceRequest {
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

  toEntity() {
    return new Place(
      this.googlePlaceId,
      this.name,
      this.thumbnailUrl,
      this.rating,
      this.location.longitude,
      this.location.latitude,
      this.formattedAddress,
      this.description,
      this.detailPageUrl,
    );
  }
}

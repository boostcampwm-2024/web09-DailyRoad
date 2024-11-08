import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  Max,
  IsUrl,
} from 'class-validator';
import { Place } from '../entity/place.entity';

export class CreatePlaceRequest {
  @IsString()
  @IsNotEmpty()
  googlePlaceId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  thumbnailUrl?: string;

  @IsNumber()
  @Min(0)
  @Max(5)
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
  category?: string;

  @IsString()
  description?: string;

  @IsUrl()
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

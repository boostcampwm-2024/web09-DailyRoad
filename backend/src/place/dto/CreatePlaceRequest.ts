import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  Max,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { Place } from '@src/place/entity/place.entity';

export class CreatePlaceRequest {
  @IsString()
  @IsNotEmpty()
  googlePlaceId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
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

  @IsOptional()
  @IsString()
  formattedAddress?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  detailPageUrl?: string;

  @IsString()
  photoReference: string;

  toEntity(thumbnailUrl: string) {
    return new Place(
      this.googlePlaceId,
      this.name,
      thumbnailUrl,
      this.rating,
      this.location.longitude,
      this.location.latitude,
      this.formattedAddress,
      this.description,
      this.detailPageUrl,
    );
  }
}

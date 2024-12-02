import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  Max,
  IsUrl,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Place } from '@src/place/entity/PlaceEntity';
import { Category } from '@src/place/enum/Category';

export class AddPlaceRequest {
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
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  detailPageUrl?: string;

  @IsString()
  photoReference: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  toEntity(thumbnailUrl: string = this.thumbnailUrl): Place {
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

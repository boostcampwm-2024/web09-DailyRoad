import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@src/common/BaseEntity';
import decimalNumericTransformer from '@src/config/DecimalTransformer';
import { Category } from '@src/place/place.category.enum';

@Entity()
export class Place extends BaseEntity {
  @Column({ unique: true, nullable: true })
  googlePlaceId?: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column('decimal', {
    precision: 3,
    scale: 2,
    transformer: decimalNumericTransformer,
  })
  rating?: number;

  @Column('decimal', {
    precision: 10,
    scale: 7,
    transformer: decimalNumericTransformer,
  })
  longitude: number;

  @Column('decimal', {
    precision: 10,
    scale: 7,
    transformer: decimalNumericTransformer,
  })
  latitude: number;

  @Column({ nullable: true })
  formattedAddress?: string;

  @Column({ nullable: true })
  category?: Category;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ nullable: true })
  detailPageUrl?: string;

  constructor(
    googlePlaceId: string,
    name: string,
    thumbnailUrl: string,
    rating: number,
    longitude: number,
    latitude: number,
    formattedAddress: string,
    description: string,
    detailPageUrl: string,
  ) {
    super();
    this.googlePlaceId = googlePlaceId;
    this.name = name;
    this.thumbnailUrl = thumbnailUrl;
    this.rating = rating;
    this.longitude = longitude;
    this.latitude = latitude;
    this.formattedAddress = formattedAddress;
    this.description = description;
    this.detailPageUrl = detailPageUrl;
  }
}

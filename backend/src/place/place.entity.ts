import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';

@Entity()
export class Place extends BaseEntity {
  @Column({ unique: true })
  googlePlaceId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column('float', { nullable: true })
  rating?: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column({ nullable: true })
  formattedAddress?: string;

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

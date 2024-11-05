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
}

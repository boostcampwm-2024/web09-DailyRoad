import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/BaseEntity';
import { User } from '../../user/entity/user.entity';
import { MapPlace } from './map-place.entity';
import { Color } from '../../place/color.enum';

@Entity()
export class Map extends BaseEntity {
  @ManyToOne(() => User, (user) => user.maps, { eager: true }) // Todo: onDelete -> soft delete
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column('text', { nullable: true })
  description?: string;

  @OneToMany(() => MapPlace, (mapPlace) => mapPlace.map, {
    eager: true,
    cascade: true,
  })
  mapPlaces: MapPlace[];

  constructor(
    user: User,
    title: string,
    isPublic: boolean,
    thumbnailUrl?: string,
    description?: string,
  ) {
    super();
    this.user = user;
    this.title = title;
    this.isPublic = isPublic;
    this.thumbnailUrl = thumbnailUrl;
    this.description = description;
  }

  get pinCount() {
    return this.mapPlaces.length;
  }

  addPlace(placeId: number, color: Color, description: string) {
    this.mapPlaces.push(MapPlace.of(placeId, this, color, description));
  }

  async deletePlace(placeId: number) {
    this.mapPlaces = this.mapPlaces.filter((p) => p.placeId !== placeId);
  }

  async hasPlace(placeId: number) {
    return this.mapPlaces.some((p) => p.placeId === placeId);
  }

  async getPlacesWithComment() {
    return await Promise.all(
      this.mapPlaces.map(async (mapPlace) => ({
        place: await mapPlace.place,
        comment: mapPlace.description,
        color: mapPlace.color,
      })),
    );
  }
}

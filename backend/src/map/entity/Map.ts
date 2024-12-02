import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@src/common/BaseEntity';
import { User } from '@src/user/entity/User';
import { MapPlace } from './MapPlace';
import { Color } from '@src/place/enum/Color';
import { PlaceInMapNotFoundException } from '@src/map/exception/PlaceInMapNotFoundException';

@Entity()
export class Map extends BaseEntity {
  // Todo. 오브젝트 스토리지에 실제 이미지 저장 후 수정
  public static readonly DEFAULT_THUMBNAIL_URL = 'https://aaa.com';

  @ManyToOne(() => User, (user) => user.maps, { eager: true }) // Todo: onDelete -> soft delete
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: Map.DEFAULT_THUMBNAIL_URL })
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

  getPlace(placeId: number) {
    const mapPlace = this.mapPlaces.find((p) => p.placeId === placeId);
    if (!mapPlace) throw new PlaceInMapNotFoundException(this.id, placeId);

    return mapPlace;
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

  hasPlace(placeId: number) {
    return this.mapPlaces.some((p) => p.placeId === placeId);
  }

  updatePlace(placeId: number, color?: Color, comment?: string) {
    const updated = this.getPlace(placeId).update(color, comment);

    this.mapPlaces = this.mapPlaces.map((mapPlace) =>
      mapPlace.placeId === placeId ? updated : mapPlace,
    );
  }

  deletePlace(placeId: number) {
    this.mapPlaces = this.mapPlaces.filter((p) => p.placeId !== placeId);
  }
}

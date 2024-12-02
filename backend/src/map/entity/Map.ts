import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@src/common/BaseEntity';
import { Color } from '@src/place/enum/Color';
import { User } from '@src/user/entity/User';
import { MapPlace } from '@src/map/entity/MapPlace';
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
  pins: MapPlace[];

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
    return this.pins.length;
  }

  addPin(placeId: number, color: Color, description: string) {
    this.pins.push(MapPlace.of(placeId, this, color, description));
  }

  getPin(placeId: number) {
    const pin = this.pins.find((p) => p.placeId === placeId);
    if (!pin) throw new PlaceInMapNotFoundException(this.id, placeId);

    return pin;
  }

  async getPinsWithComment() {
    return await Promise.all(
      this.pins.map(async (pin) => ({
        place: await pin.place,
        comment: pin.description,
        color: pin.color,
      })),
    );
  }

  hasPlace(placeId: number) {
    return this.pins.some((p) => p.placeId === placeId);
  }

  updatePin(placeId: number, color?: Color, comment?: string) {
    const updated = this.getPin(placeId).update(color, comment);

    this.pins = this.pins.map((pin) =>
      pin.placeId === placeId ? updated : pin,
    );
  }

  deletePin(placeId: number) {
    this.pins = this.pins.filter((p) => p.placeId !== placeId);
  }
}

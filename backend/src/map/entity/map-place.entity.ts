import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@src/common/BaseEntity';
import { Place } from '@src/place/entity/place.entity';
import { Map } from './map.entity';
import { Color } from '@src/place/place.color.enum';

@Entity()
export class MapPlace extends BaseEntity {
  @Column()
  placeId: number;

  @ManyToOne(() => Place, { onDelete: 'CASCADE', lazy: true })
  @JoinColumn({ name: 'place_id' })
  place: Promise<Place>;

  @ManyToOne(() => Map, (map) => map.mapPlaces, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'map_id' })
  map: Map;

  @Column('text', { nullable: true })
  description?: string;

  @Column()
  color: Color;

  static of(placeId: number, map: Map, color: Color, description?: string) {
    const place = new MapPlace();
    place.map = map;
    place.color = color;
    place.placeId = placeId;
    place.place = Promise.resolve({ id: placeId } as Place);
    place.description = description;
    return place;
  }

  /**
   * 업데이트 정보를 가진 새 객체를 반환합니다.
   * @param color
   * @param comment
   */
  update(color?: Color, comment?: string) {
    return MapPlace.of(
      this.placeId,
      this.map,
      color || this.color,
      comment || this.description,
    );
  }
}

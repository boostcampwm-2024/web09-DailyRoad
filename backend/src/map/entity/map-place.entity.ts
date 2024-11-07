import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/BaseEntity';
import { Place } from '../../place/entity/place.entity';
import { Map } from './map.entity';

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

  static of(placeId: number, map: Map, description?: string) {
    const place = new MapPlace();
    place.map = map;
    place.placeId = placeId;
    place.place = Promise.resolve({ id: placeId } as Place);
    place.description = description;
    return place;
  }
}

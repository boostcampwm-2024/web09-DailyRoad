import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/BaseEntity';
import { Place } from '../../place/entity/place.entity';
import { Map } from './map.entity';

@Entity()
export class MapPlace extends BaseEntity {
  @ManyToOne(() => Place, { onDelete: 'CASCADE', lazy: true })
  @JoinColumn({ name: 'place_id' })
  place: Promise<Place>;

  @ManyToOne(() => Map, (map) => map.mapPlaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'map_id' })
  map: Map;

  @Column('text', { nullable: true })
  description?: string;
}

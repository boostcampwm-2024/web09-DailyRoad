import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';
import { Place } from '../place/place.entity';
import { Map } from './map.entity';

@Entity()
export class MapPlace extends BaseEntity {
  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @ManyToOne(() => Map, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'map_id' })
  map: Promise<Map>;

  @Column('text', { nullable: true })
  description: string;
}

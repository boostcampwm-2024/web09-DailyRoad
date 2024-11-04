import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Place } from './place.entity';
import { Map } from './map.entity';

@Entity()
export class MapPlace extends BaseEntity {
  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  map: Map;
  @ManyToOne(() => Map, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'map_id' })

  @Column('text', { nullable: true })
  description: string;
}

import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {BaseEntity} from './base.entity';
import {Place} from './place.entity';
import {Map} from './map.entity';

@Entity('MAP_PLACE')
export class MapPlace extends BaseEntity {
  @ManyToOne(() => Place, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'place_id'})
  place: Place;

  @ManyToOne(() => Map, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'map_id'})
  map: Map;

  @Column('text', {nullable: true})
  description: string;
}

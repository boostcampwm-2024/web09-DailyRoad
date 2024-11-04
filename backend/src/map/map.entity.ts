import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';
import { User } from '../user/user.entity';
import { MapPlace } from './map-place.entity';
import { Place } from '../place/place.entity';

@Entity()
export class Map extends BaseEntity {
  @ManyToOne(() => User, (user) => user.maps) // Todo. onDelete -> soft delete
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  thumbnail: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @OneToMany(() => MapPlace, (mapPlace) => mapPlace.map)
  private mapPlaces: Promise<MapPlace[]>;

  async getPlaces(): Promise<Place[]> {
    const mapPlaces = await this.mapPlaces;
    return await Promise.all(mapPlaces.map((mapPlace) => mapPlace.place));
  }
}

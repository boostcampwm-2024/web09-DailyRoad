import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './user.entity';
import { MapPlace } from './map-place.entity';
import { Place } from './place.entity';

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
}

import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {BaseEntity} from './base.entity';
import {User} from './user.entity';

@Entity('MAP')
export class Map extends BaseEntity {
  @ManyToOne(() => User, (user) => user.maps) // Todo. onDelete -> soft delete
  @JoinColumn({name: 'user_id'})
  user: User;

  @Column({nullable: true})
  thumbnail: string;

  @Column()
  title: string;

  @Column('text', {nullable: true})
  description: string;
}

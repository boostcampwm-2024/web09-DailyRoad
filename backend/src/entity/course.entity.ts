import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {BaseEntity} from './base.entity';
import {User} from './user.entity';

@Entity('COURSE')
export class Course extends BaseEntity {
  @ManyToOne(() => User, (user) => user.courses)
  @JoinColumn({name: 'user_id'})
  user: User;

  @Column({nullable: true})
  thumbnail: string;

  @Column()
  title: string;

  @Column('text', {nullable: true})
  description: string;
}

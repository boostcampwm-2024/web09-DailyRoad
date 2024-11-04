import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './user.entity';
import { Place } from './place.entity';
import { CoursePlace } from './course-place.entity';

@Entity()
export class Course extends BaseEntity {
  @ManyToOne(() => User, (user) => user.courses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  thumbnail: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;
}

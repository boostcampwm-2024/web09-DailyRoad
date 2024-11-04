import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Place } from './place.entity';
import { Course } from './course.entity';

@Entity()
export class CoursePlace extends BaseEntity {
  @Column()
  order: number;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Promise<Course>;

  @Column('text', { nullable: true })
  description: string;
}

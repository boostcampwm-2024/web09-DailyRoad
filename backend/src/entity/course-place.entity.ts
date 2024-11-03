import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import {BaseEntity} from './base.entity';
import {Place} from './place.entity';
import {Course} from './course.entity';

@Entity('COURSE_PLACE')
export class CoursePlace extends BaseEntity {
  @Column()
  order: number;

  @ManyToOne(() => Place, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'place_id'})
  place: Place;

  @ManyToOne(() => Course, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'course_id'})
  course: Course;

  @Column('text', {nullable: true})
  description: string;
}

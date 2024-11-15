import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/BaseEntity';
import { Place } from '../../place/entity/place.entity';
import { Course } from './course.entity';

@Entity()
export class CoursePlace extends BaseEntity {
  @Column()
  order: number;

  @ManyToOne(() => Place, { onDelete: 'CASCADE', lazy: true })
  @JoinColumn({ name: 'place_id' })
  place: Promise<Place>;

  @ManyToOne(() => Course, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column('text', { nullable: true })
  description?: string;

  static of(
    order: number,
    placeId: number,
    course: Course,
    description?: string,
  ) {
    const place = new CoursePlace();
    place.course = course;
    place.order = order;
    place.place = Promise.resolve({ id: placeId } as Place);
    place.description = description;
    return place;
  }
}

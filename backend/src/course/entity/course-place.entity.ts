import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@src/common/BaseEntity';
import { Place } from '@src/place/entity/place.entity';
import { Course } from './course.entity';

@Entity()
export class CoursePlace extends BaseEntity {
  @Column()
  order: number;

  @Column()
  placeId: number;

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
    place.placeId = placeId;
    place.place = Promise.resolve({ id: placeId } as Place);
    place.description = description;
    return place;
  }

  /**
   * 업데이트 정보를 가진 새 객체를 반환합니다.
   * @param description
   */
  update(description?: string) {
    return CoursePlace.of(
      this.order,
      this.placeId,
      this.course,
      description || this.description,
    );
  }
}

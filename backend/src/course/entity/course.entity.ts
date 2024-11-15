import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/BaseEntity';
import { User } from '../../user/entity/user.entity';
import { CoursePlace } from './course-place.entity';
import { SetPlacesOfCourseRequestItem } from '../dto/AddPlaceToCourseRequest';

@Entity()
export class Course extends BaseEntity {
  @ManyToOne(() => User, (user) => user.courses, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  isPublic: boolean;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @OneToMany(() => CoursePlace, (coursePlace) => coursePlace.course, {
    eager: true,
    cascade: true,
  })
  coursePlaces: CoursePlace[];

  constructor(
    user: User,
    title: string,
    isPublic: boolean,
    thumbnailUrl?: string,
    description?: string,
  ) {
    super();
    this.user = user;
    this.title = title;
    this.isPublic = isPublic;
    this.thumbnailUrl = thumbnailUrl;
    this.description = description;
  }

  get pinCount() {
    return this.coursePlaces.length;
  }

  setPlaces(coursePlaces: SetPlacesOfCourseRequestItem[]) {
    this.coursePlaces = coursePlaces.map((item, index) => {
      return CoursePlace.of(index + 1, item.placeId, this, item.comment);
    });
  }

  async getPlacesWithComment() {
    const coursePlaces = this.coursePlaces.sort((a, b) => a.order - b.order);
    return await Promise.all(
      coursePlaces.map(async (coursePlace) => ({
        place: await coursePlace.place,
        comment: coursePlace.description,
      })),
    );
  }
}

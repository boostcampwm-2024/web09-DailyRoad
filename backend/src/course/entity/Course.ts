import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/BaseEntity';
import { User } from '../../user/entity/User';
import { CoursePlace } from './CoursePlace';
import { SetPlacesOfCourseRequestItem } from '../dto/AddPlaceToCourseRequest';
import { PlaceInCourseNotFoundException } from '@src/course/exception/PlaceInCourseNotFoundException';

@Entity()
export class Course extends BaseEntity {
  // Todo. 오브젝트 스토리지에 실제 이미지 저장 후 수정
  public static readonly DEFAULT_THUMBNAIL_URL =
    'https://avatars.githubusercontent.com/u/87180146?v=4';

  @ManyToOne(() => User, (user) => user.courses, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  isPublic: boolean;

  @Column({ default: Course.DEFAULT_THUMBNAIL_URL })
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
    if (!this.coursePlaces) return 0;
    return this.coursePlaces.length;
  }

  setPlaces(coursePlaces: SetPlacesOfCourseRequestItem[]) {
    this.coursePlaces = coursePlaces.map((item, index) => {
      return CoursePlace.of(index + 1, item.placeId, this, item.comment);
    });
  }

  getPlace(placeId: number) {
    const coursePlace = this.coursePlaces.find(
      (coursePlace) => coursePlace.placeId === placeId,
    );
    if (!coursePlace) {
      throw new PlaceInCourseNotFoundException(this.id, placeId);
    }
    return coursePlace;
  }

  updatePlace(placeId: number, comment?: string) {
    const updated = this.getPlace(placeId).update(comment);
    this.coursePlaces = this.coursePlaces.map((coursePlace) =>
      coursePlace.placeId === placeId ? updated : coursePlace,
    );
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

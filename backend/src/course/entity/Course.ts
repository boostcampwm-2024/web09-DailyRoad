import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@src/common/BaseEntity';
import { User } from '@src/user/entity/User';
import { CoursePlace } from '@src/course/entity/CoursePlace';
import { UpdatePinsOfCourseRequestItem } from '@src/course/dto/UpdatePinsOfCourseRequest';
import { PlaceInCourseNotFoundException } from '@src/course/exception/PlaceInCourseNotFoundException';

@Entity()
export class Course extends BaseEntity {
  public static readonly DEFAULT_THUMBNAIL_URL =
    'https://kr.object.ncloudstorage.com/ogil-public/post/uploads/35af1797a54a.jpg';

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
  pins: CoursePlace[];

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
    if (!this.pins) return 0;
    return this.pins.length;
  }

  setPins(pins: UpdatePinsOfCourseRequestItem[]) {
    this.pins = pins.map((item, index) => {
      return CoursePlace.of(index + 1, item.placeId, this, item.comment);
    });
  }

  getPin(placeId: number) {
    const pin = this.pins.find((pin) => pin.placeId === placeId);
    if (!pin) {
      throw new PlaceInCourseNotFoundException(this.id, placeId);
    }
    return pin;
  }

  updatePin(placeId: number, comment?: string) {
    const updated = this.getPin(placeId).update(comment);
    this.pins = this.pins.map((pin) =>
      pin.placeId === placeId ? updated : pin,
    );
  }

  async getPinsWithComment() {
    const pins = this.pins.sort((a, b) => a.order - b.order);
    return await Promise.all(
      pins.map(async (pin) => ({
        place: await pin.place,
        comment: pin.description,
      })),
    );
  }
}

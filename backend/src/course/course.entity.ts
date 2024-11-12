import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';
import { User } from '../user/entity/user.entity';
import { Place } from '../place/entity/place.entity';
import { CoursePlace } from './course-place.entity';

@Entity()
export class Course extends BaseEntity {
  @ManyToOne(() => User, (user) => user.courses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @OneToMany(() => CoursePlace, (coursePlace) => coursePlace.course)
  private coursePlaces: Promise<CoursePlace[]>;

  async getPlaces(): Promise<Place[]> {
    const mapPlaces = await this.coursePlaces;
    return await Promise.all(mapPlaces.map((coursePlace) => coursePlace.place));
  }
}

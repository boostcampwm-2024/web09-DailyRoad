import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';
import { Course } from '../course/course.entity';
import { Map } from '../map/map.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  provider: string;

  @Column()
  nickname: string;

  @Column({ unique: true })
  oauthId: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @OneToMany(() => Map, (map) => map.user)
  maps: Promise<Map[]>;

  @OneToMany(() => Course, (course) => course.user)
  courses: Promise<Course[]>;
}

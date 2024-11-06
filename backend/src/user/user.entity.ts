import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';
import { Course } from '../course/entity/course.entity';
import { Map } from '../map/entity/map.entity';

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

  constructor(
    provider: string,
    nickname: string,
    oauthId: string,
    role: string,
    profileImageUrl?: string,
  ) {
    super();
    this.provider = provider;
    this.nickname = nickname;
    this.oauthId = oauthId;
    this.role = role;
    this.profileImageUrl = profileImageUrl;
  }
}

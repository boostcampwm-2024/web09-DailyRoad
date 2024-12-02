import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/BaseEntity';
import { Course } from '../../course/entity/Course';
import { Map } from '../../map/entity/Map';
import { Role } from '../enum/Role';

@Entity()
export class User extends BaseEntity {
  @Column()
  provider: string;

  @Column()
  nickname: string;

  @Column({ unique: true })
  oauthId: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.MEMBER,
  })
  role: Role;

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
    role: Role,
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

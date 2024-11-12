import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/BaseEntity';
import { Course } from '../../course/entity/course.entity';
import { Map } from '../../map/entity/map.entity';
import { UserRole } from '../user.role';

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
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

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
    role: UserRole,
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

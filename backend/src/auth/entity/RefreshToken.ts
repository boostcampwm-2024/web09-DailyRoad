import { Entity, JoinColumn, OneToOne, PrimaryColumn, Column } from 'typeorm';
import { User } from '../../user/entity/User';

@Entity()
export class RefreshToken {
  @PrimaryColumn()
  token: string;

  @Column()
  userId: number;

  @OneToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}

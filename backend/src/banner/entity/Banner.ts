import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@src/common/BaseEntity';

@Entity()
export class Banner extends BaseEntity {
  @Column()
  imageUrl: string;

  @Column()
  redirectUrl: string;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp' })
  endedAt: Date;
}

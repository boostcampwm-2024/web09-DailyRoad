import { RefreshToken } from './entity/RefreshToken';
import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(private dataSource: DataSource) {
    super(RefreshToken, dataSource.createEntityManager());
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.delete({ user: { id: userId } });
  }
}

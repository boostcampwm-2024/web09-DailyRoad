import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { Injectable } from '@nestjs/common';
import { SoftDeleteRepository } from '../common/SoftDeleteRepository';

@Injectable()
export class UserRepository extends SoftDeleteRepository<User, number> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByProviderAndOauthId(
    provider: string,
    oauthId: string,
  ): Promise<User> {
    return this.findOne({
      where: {
        provider,
        oauthId,
      },
    });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.create();
    Object.assign(user, {
      provider: userData.provider,
      oauthId: userData.oauthId,
      nickname: userData.nickname,
      role: userData.role,
      profileImageUrl: userData.profileImageUrl,
    });
    return this.save(user);
  }
}

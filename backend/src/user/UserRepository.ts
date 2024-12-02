import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SoftDeleteRepository } from '@src/common/SoftDeleteRepository';
import { User } from '@src/user/entity/User';

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

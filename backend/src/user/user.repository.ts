import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { UserIconResponse } from './dto/UserIconResponse';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

@Injectable()
export class UserRepository {
  private readonly repository: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  async findOne(id: number): Promise<UserIconResponse | undefined> {
    const user = await this.repository.findOne({ where: { id } });
    return UserIconResponse.from(user);
  }

  async findByProviderAndOauthId(
    provider: string,
    oauthId: string,
  ): Promise<User | undefined> {
    return this.repository.findOne({ where: { provider, oauthId } });
  }

  async create(userData: Partial<User>): Promise<User> {
    return this.repository.create({
      provider: userData.provider,
      oauthId: userData.oauthId,
      nickname: userData.nickname,
      role: userData.role,
      profileImageUrl: userData.profileImageUrl,
    });
  }

  async save(user: User) {
    return this.repository.save(user);
  }

  async upsert(user: User, options: UpsertOptions<User>) {
    await this.repository.upsert(user, options);
  }
}

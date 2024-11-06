import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { userInfoWithProvider } from './userType';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async saveUser(userInfo: userInfoWithProvider) {
    const { provider, name, picture, oauthId } = userInfo;
    await this.userRepository.upsert(
      {
        provider,
        nickname: name,
        oauthId: oauthId,
        profileImageUrl: picture,
        role: 'user',
      },
      { conflictPaths: ['id'] },
    );
  }
}

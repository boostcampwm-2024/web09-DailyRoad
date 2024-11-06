import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

type userInfoWithProvider = {
  provider: string;
  name: string;
  oauthId: string;
  picture: string;
};

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async saveUser(userInfo: userInfoWithProvider) {
    const { provider, name, picture, oauthId } = userInfo;
    const user = await this.userRepository.findByProviderAndOauthId(
      provider,
      oauthId,
    );
    if (!user) {
      const newUser = await this.userRepository.create({
        provider,
        nickname: name,
        oauthId: oauthId,
        profileImageUrl: picture,
        role: 'user',
      });
      await this.userRepository.save(newUser);
    }
  }
}

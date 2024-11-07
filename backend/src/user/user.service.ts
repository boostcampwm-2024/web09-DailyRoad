import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserRequest } from './dto/CreateUserRequest';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async addUser(userInfo: CreateUserRequest) {
    const { provider, oauthId } = userInfo;
    const existingUser = await this.userRepository.findByProviderAndOauthId(
      provider,
      oauthId,
    );
    if (existingUser) {
      return {
        userId: existingUser.id,
        role: existingUser.role,
      };
    }
    const user = userInfo.toEntity();
    const newUser = await this.userRepository.save(user);
    return { userId: newUser.id, role: newUser.role };
  }
}

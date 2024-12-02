import { Injectable } from '@nestjs/common';
import { UserRepository } from '@src/user/UserRepository';
import { CreateUserRequest } from '@src/user/dto/CreateUserRequest';
import { UserIconResponse } from '@src/user/dto/UserIconResponse';
import { UserNotFoundException } from '@src/user/exception/UserNotFoundException';

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

  async getUserInfo(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    return UserIconResponse.from(user);
  }
}

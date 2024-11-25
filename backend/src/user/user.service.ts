import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserRequest } from './dto/CreateUserRequest';
import { UserIconResponse } from '@src/user/dto/UserIconResponse';
import { UserNotFoundException } from '@src/user/exception/UserNotFoundException';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  @Transactional()
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

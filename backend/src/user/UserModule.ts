import { Module } from '@nestjs/common';
import { UserController } from './UserController';
import { UserService } from './UserService';
import { UserRepository } from './UserRepository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}

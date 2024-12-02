import { Module } from '@nestjs/common';
import { UserController } from '@src/user/UserController';
import { UserService } from '@src/user/UserService';
import { UserRepository } from '@src/user/UserRepository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}

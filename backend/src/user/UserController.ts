import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './UserService';
import { JwtAuthGuard } from '@src/auth/JwtAuthGuard';
import { AuthUser } from '@src/auth/decortator/AuthUser';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@AuthUser() user: AuthUser) {
    return await this.userService.getUserInfo(user.userId);
  }
}

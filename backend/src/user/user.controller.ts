import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async getUserInfo(@Param('id') id: number) {
    return await this.userService.getUserInfo(id);
  }
}

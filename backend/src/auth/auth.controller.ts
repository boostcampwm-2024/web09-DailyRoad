import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserRequest } from '../user/dto/CreateUserRequest';

@Controller('oauth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('google/signIn')
  async googleSignIn() {
    return this.authService.getGoogleAuthUrl();
  }

  @Post('google/signIn')
  async googleCallback(@Body('code') code: string) {
    const tokens = await this.authService.getGoogleToken(code);
    const userInfo = await this.authService.getGoogleUserInfo(
      tokens.accessToken,
    );
    const user = new CreateUserRequest({
      ...userInfo,
      provider: 'google',
      role: 'member',
    });
    const { userId, role } = await this.userService.addUser(user);
    return {
      token: this.authService.generateJwt({
        userId,
        role,
      }),
    };
  }
}

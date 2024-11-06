import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('oauth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('google/signIn')
  @HttpCode(201)
  async googleCallback(@Body('code') code: string) {
    const tokens = await this.authService.getGoogleToken(code);
    const userInfo = await this.authService.getGoogleUserInfo(
      tokens.accessToken,
    );
    const user = {
      provider: 'google',
      ...userInfo,
    };
    await this.userService.saveUser(user);
    return {
      token: this.authService.generateJwt({
        provider: 'google',
        ...userInfo,
      }),
    };
  }
}

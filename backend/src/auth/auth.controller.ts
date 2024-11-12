import { Request, Response } from 'express';
import { Body, Controller, Post, Get, Param, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationException } from './exception/AuthenticationException';
import { getOAuthProviderNameByValue } from './oauthProvider/OAuthProviders';

const REFRESH_TOKEN = 'refreshToken';

@Controller('oauth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':provider/signIn')
  async getSignInUrl(@Param('provider') provider: string) {
    return this.authService.getSignInUrl(getOAuthProviderNameByValue(provider));
  }

  @Post(':provider/signIn')
  async handleCallback(
    @Param('provider') provider: string,
    @Body('code') code: string,
    @Res() response: Response,
  ) {
    const tokens = await this.authService.signInWith(
      getOAuthProviderNameByValue(provider),
      code,
    );

    response.setHeader(
      'Set-Cookie',
      `${REFRESH_TOKEN}=${tokens.refreshToken}; HttpOnly; Path=/; SameSite=None; Secure;`,
    );

    response.json({
      accessToken: tokens.accessToken,
    });
  }

  @Post('refresh')
  async refreshAccessToken(@Req() req: Request) {
    const refreshToken = req.cookies[REFRESH_TOKEN];
    if (!refreshToken) {
      throw new AuthenticationException('리프레시 토큰이 없습니다.');
    }

    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return { accessToken };
  }
}

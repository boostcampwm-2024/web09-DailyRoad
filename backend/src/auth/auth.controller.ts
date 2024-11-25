import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Res,
  Req,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticationException } from './exception/AuthenticationException';
import { getOAuthProviderNameByValue } from './oauthProvider/OAuthProviders';
import { JwtAuthGuard } from '@src/auth/JwtAuthGuard';
import { AuthUser } from '@src/auth/AuthUser.decorator';

const REFRESH_TOKEN = 'refreshToken';

@Controller('oauth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':provider/signIn')
  async getSignInUrl(
    @Param('provider') provider: string,
    @Req() request: Request,
  ) {
    const origin = request.headers.origin;

    return this.authService.getSignInUrl(
      getOAuthProviderNameByValue(provider),
      origin,
    );
  }

  @Post(':provider/signIn')
  async handleCallback(
    @Param('provider') provider: string,
    @Body('code') code: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const origin = request.headers.origin;
    const tokens = await this.authService.signInWith(
      getOAuthProviderNameByValue(provider),
      origin,
      code,
    );

    response.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    response.json({
      accessToken: tokens.accessToken,
    });
  }

  @Delete('signOut')
  @UseGuards(JwtAuthGuard)
  async signOut(@Res() response: Response, @AuthUser() user: AuthUser) {
    await this.authService.signOut(user.userId);
    response.clearCookie(REFRESH_TOKEN, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    response.status(204).send();
  }

  @Post('refresh')
  async refreshAccessToken(@Req() request: Request) {
    const refreshToken = request.cookies[REFRESH_TOKEN];
    if (!refreshToken) {
      throw new AuthenticationException('리프레시 토큰이 없습니다.');
    }

    const accessToken = await this.authService.refreshAccessToken(refreshToken);
    return { accessToken };
  }
}

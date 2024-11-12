import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { googleTokenResponse, googleUserResponse } from './auth.type';
import { JWTHelper } from './JWTHelper';
import { AuthenticationException } from './exception/AuthenticationException';
import { addBearerToken } from './utils';

@Injectable()
export class AuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

    this.clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    this.redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
  private readonly accessTokenExpiration: string;
  private readonly refreshTokenExpiration: string;
  constructor(
    private readonly jwtHelper: JWTHelper,
    this.accessTokenExpiration = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION',
    );
    this.refreshTokenExpiration = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );
  }

  getGoogleAuthUrl() {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('redirect_uri', this.redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'openid profile');
    return url.toString();
  }

  async getGoogleToken(code: string): Promise<{ accessToken: string }> {
    return fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: decodeURIComponent(code),
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
    })
      .then((response: Response) => response.json())
      .then((data) => {
        const tokens = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        };
        if (!this.validateTokenResponse(tokens))
          throw new AuthenticationException('Invalid Google Response');
        return {
          accessToken: tokens.access_token,
        };
      })
      .catch((err) => {
        throw new Error(err);
      });
    return await this.generateTokens(userId, role);
  }

  }

  private async generateTokens(userId: number, role: string) {
    const accessToken = this.jwtHelper.generateToken(
      {
        userId,
        role,
      },
      this.accessTokenExpiration,
    );

    const refreshToken = this.jwtHelper.generateToken(
      {},
      this.refreshTokenExpiration,
    );

    await this.refreshTokenRepository.upsert(
      {
        token: refreshToken,
        user: { id: userId },
      },
      { conflictPaths: ['userId'] },
    );

    return { accessToken, refreshToken };
  }

    });
  }

  async getGoogleUserInfo(accessToken: string) {
    const url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    return fetch(url, {
      headers: {
        authorization: addBearerToken(accessToken),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!this.validateUserInformationResponse(data)) {
          throw new Error('Invalid Google User Information Response');
        }
        return {
          oauthId: data?.id,
          name: data?.name,
          picture: data?.picture,
        };
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
}

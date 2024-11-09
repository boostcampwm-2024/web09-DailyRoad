import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { googleTokenResponse, googleUserResponse } from './auth.type';
import { AuthenticationException } from './exception/AuthenticationException';

@Injectable()
export class AuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly jwtSecretKey: string;
  private readonly jwtExpiration: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    this.redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY');
    this.jwtExpiration = this.configService.get<string>('JWT_EXPIRATION');
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
  }

  private validateTokenResponse(
    response: any,
  ): response is googleTokenResponse {
    return response && typeof response.access_token === 'string';
  }

  private validateUserInformationResponse(
    response: any,
  ): response is googleUserResponse {
    return (
      response &&
      typeof response.id === 'string' &&
      typeof response.picture === 'string' &&
      typeof response.name === 'string'
    );
  }

  generateJwt(payload: any): string {
    return jwt.sign(payload, this.jwtSecretKey, {
      expiresIn: this.jwtExpiration,
    });
  }

  async getGoogleUserInfo(accessToken: string) {
    const url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    return fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
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

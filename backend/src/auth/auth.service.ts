import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

type googleTokenResponse = {
  access_token: string;
  refresh_token: string;
};

type googleUserResponse = {
  id: string;
  picture: string;
  name: string;
};

//

@Injectable()
export class AuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly jwtSecretKey: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    this.redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI');
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY');
  }

  async getGoogleToken(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const data = await response.json();
    const tokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
    if (!this.validateTokenResponse(tokens)) {
      throw new Error('Invalid Google Response');
    } else {
      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      };
    }
  }

  private validateTokenResponse(
    response: any,
  ): response is googleTokenResponse {
    return (
      response &&
      typeof response.access_token === 'string' &&
      typeof response.refresh_token === 'string'
    );
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

  generateJwtToken(payload: any): string {
    return jwt.sign(payload, this.jwtSecretKey, {
      expiresIn: '30m',
    });
  }

  async getGoogleUserInfo(accessToken: string) {
    const url = 'https://www.googleapis.com/oauth2/v2/userinfo';
    const response = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    if (!this.validateUserInformationResponse(data)) {
      throw new Error('Invalid Google User Information Response');
    }
    return {
      oauthId: data?.id,
      name: data?.name,
      picture: data?.picture,
    };
  }
}

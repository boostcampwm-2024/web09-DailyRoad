import { OAuthProvider } from './OAuthProvider';
import { addBearerToken } from '../utils';
import { AuthenticationException } from '../exception/AuthenticationException';
import { isGoogleTokenResponse, isGoogleUserResponse } from '../auth.type';
import { ConfigService } from '@nestjs/config';
import { OAuthProviders } from './OAuthProviders';

export class GoogleOAuthProvider extends OAuthProvider {
  constructor(configService: ConfigService) {
    super(OAuthProviders.GOOGLE, configService);
  }

  getAuthUrl(): string {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('redirect_uri', this.redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'openid profile');
    return url.toString();
  }

  private async getToken(code: string): Promise<string> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
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
    });

    const data = await response.json();
    if (!isGoogleTokenResponse(data)) {
      throw new AuthenticationException('Invalid Google Token Response');
    }
    return data.access_token;
  }

  async getUserInfo(code: string): Promise<any> {
    const token = await this.getToken(code);
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          authorization: addBearerToken(token),
        },
      },
    );
    const data = await response.json();
    if (!isGoogleUserResponse(data)) {
      throw new AuthenticationException(
        'Invalid Google User Information Response',
      );
    }
    return {
      oauthId: data.id,
      name: data.name,
      picture: data.picture,
    };
  }
}

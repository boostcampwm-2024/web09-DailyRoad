import { ConfigService } from '@nestjs/config';
import { OAuthProviders } from './OAuthProviders';
import { OAuthUserInfo } from '@src/auth/type';
import { AuthenticationException } from '@src/auth/exception/AuthenticationException';

export abstract class OAuthProvider {
  protected readonly clientId: string;
  protected readonly clientSecret: string;
  protected readonly allowedOrigins: string[];

  protected constructor(
    readonly providerName: OAuthProviders,
    private configService: ConfigService,
  ) {
    const upperCaseProviderName = providerName.toUpperCase();

    this.clientId = this.configService.get<string>(
      `${upperCaseProviderName}_CLIENT_ID`,
    );
    this.clientSecret = this.configService.get<string>(
      `${upperCaseProviderName}_CLIENT_SECRET`,
    );

    const origins = this.configService.get<string>(
      `${upperCaseProviderName}_ALLOWED_ORIGINS`,
    );
    this.allowedOrigins = origins
      ? origins.split(',').map((origin) => origin.trim())
      : [];
  }

  abstract getAuthUrl(origin: string): string;

  abstract getUserInfo(origin: string, token: string): Promise<OAuthUserInfo>;

  protected getRedirectUrl(origin: string): string {
    const OAUTH_CALLBACK_PATH = '/auth/callback';

    if (!this.allowedOrigins.includes(origin)) {
      throw new AuthenticationException(
        `[${this.providerName.toUpperCase()}] 허용되지 않은 도메인 입니다. : ${origin}`,
      );
    }
    return origin + OAUTH_CALLBACK_PATH;
  }
}

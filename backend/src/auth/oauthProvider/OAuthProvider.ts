import { ConfigService } from '@nestjs/config';

export type OAuthProviderName = keyof typeof OAuthProviders;

export enum OAuthProviders {
  GOOGLE = 'google',
}

export function getOAuthProviderNameByValue(
  value: string,
): OAuthProviderName | undefined {
  return (Object.entries(OAuthProviders).find(([, v]) => v === value) ||
    [])[0] as OAuthProviderName | undefined;
}

export abstract class OAuthProvider {
  protected readonly clientId: string;
  protected readonly clientSecret: string;
  protected readonly redirectUri: string;

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
    this.redirectUri = this.configService.get<string>(
      `${upperCaseProviderName}_REDIRECT_URI`,
    );
  }

  abstract getAuthUrl(): string;

  abstract getUserInfo(token: string): Promise<any>;
}

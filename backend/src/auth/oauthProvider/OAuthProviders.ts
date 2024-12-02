import { ConfigService } from '@nestjs/config';
import { GoogleOAuthProvider } from '@src/auth/oauthProvider/GoogleOAuthProvider';
import { OAuthProvider } from '@src/auth/oauthProvider/OAuthProvider';

/**
 * 지원하는 OAuth 제공자의 이름을 정의합니다.
 */
export enum OAuthProviders {
  GOOGLE = 'google',
}

export type OAuthProviderName = keyof typeof OAuthProviders;

/**
 * 지원하는 OAuth 제공자 인스턴스들을 생성합니다.
 * @param configService
 */
export function getOAuthProviders(
  configService: ConfigService,
): Record<OAuthProviderName, OAuthProvider> {
  return {
    GOOGLE: new GoogleOAuthProvider(configService),
  };
}

/**
 * OAuth 제공자의 이름을 찾아 반환합니다.
 * @param value
 */
export function getOAuthProviderNameByValue(
  value: string,
): OAuthProviderName | undefined {
  return (Object.entries(OAuthProviders).find(([, v]) => v === value) ||
    [])[0] as OAuthProviderName | undefined;
}

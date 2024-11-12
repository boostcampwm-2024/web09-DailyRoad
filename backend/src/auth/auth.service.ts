import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTHelper } from './JWTHelper';
import { CreateUserRequest } from '../user/dto/CreateUserRequest';
import { UserService } from '../user/user.service';
import { RefreshTokenRepository } from './refresh-token.repository';
import {
  OAuthProviderName,
  OAuthProvider,
} from './oauthProvider/OAuthProvider';
import { GoogleOAuthProvider } from './oauthProvider/GoogleOAuthProvider';
import { AuthenticationException } from './exception/AuthenticationException';
import { Role } from '../user/role.enum';

@Injectable()
export class AuthService {
  private readonly providers: Record<OAuthProviderName, OAuthProvider> = {
    GOOGLE: new GoogleOAuthProvider(this.configService),
  };

  private readonly accessTokenExpiration: string;
  private readonly refreshTokenExpiration: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtHelper: JWTHelper,
  ) {
    this.accessTokenExpiration = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION',
    );
    this.refreshTokenExpiration = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );
  }

  getSignInUrl(providerName: OAuthProviderName) {
    const provider = this.getProvider(providerName);
    return provider.getAuthUrl();
  }

  async signInWith(providerName: OAuthProviderName, code: string) {
    const provider = this.getProvider(providerName);

    const userInfo = await provider.getUserInfo(code);
    const user = new CreateUserRequest({
      ...userInfo,
      provider: providerName,
      role: Role.MEMBER,
    });
    const { userId, role } = await this.userService.addUser(user);
    return await this.generateTokens(userId, role);
  }

  private getProvider(providerName: OAuthProviderName) {
    const provider = this.providers[providerName];
    if (!provider) {
      throw new AuthenticationException('지원하지 않는 OAuth 제공자입니다');
    }
    return provider;
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
}

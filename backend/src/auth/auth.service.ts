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
    private readonly refreshTokenRepository: RefreshTokenRepository,
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

    // Todo. 아래 로직 포함하는 메서드를 유저 서비스에서 제공
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

  async refreshAccessToken(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (!tokenEntity) {
      throw new AuthenticationException('유효하지 않은 리프레시 토큰입니다.');
    }

    const isTokenValid = this.jwtHelper.verifyToken(refreshToken);
    if (!isTokenValid) {
      throw new AuthenticationException('리프레시 토큰이 만료되었습니다.');
    }

    return this.jwtHelper.generateToken(
      { userId: tokenEntity.user.id, role: tokenEntity.user.role },
      this.accessTokenExpiration,
    );
  }
}

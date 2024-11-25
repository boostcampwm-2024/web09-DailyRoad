import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTHelper } from '@src/auth/JWTHelper';
import { CreateUserRequest } from '@src/user/dto/CreateUserRequest';
import { UserService } from '@src/user/user.service';
import { RefreshTokenRepository } from '@src/auth/refresh-token.repository';
import { OAuthProvider } from '@src/auth/oauthProvider/OAuthProvider';
import { AuthenticationException } from '@src/auth/exception/AuthenticationException';
import { UserRole } from '@src/user/user.role';
import {
  getOAuthProviders,
  OAuthProviderName,
} from '@src/auth/oauthProvider/OAuthProviders';

@Injectable()
export class AuthService {
  private readonly providers: Record<OAuthProviderName, OAuthProvider>;

  private readonly accessTokenExpiration: string;
  private readonly refreshTokenExpiration: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtHelper: JWTHelper,
  ) {
    this.providers = getOAuthProviders(this.configService);

    this.accessTokenExpiration = this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRATION',
    );
    this.refreshTokenExpiration = this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRATION',
    );
  }

  getSignInUrl(providerName: OAuthProviderName, origin: string) {
    const provider = this.getProvider(providerName);
    return provider.getAuthUrl(origin);
  }

  async signInWith(
    providerName: OAuthProviderName,
    origin: string,
    code: string,
  ) {
    const provider = this.getProvider(providerName);

    const userInfo = await provider.getUserInfo(origin, code);

    // Todo. 아래 로직 포함하는 메서드를 유저 서비스에서 제공
    const user = new CreateUserRequest({
      ...userInfo,
      provider: providerName,
      role: UserRole.MEMBER,
    });
    const { userId, role } = await this.userService.addUser(user);
    return await this.generateTokens(userId, role);
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

    return this.jwtHelper.generateToken(this.accessTokenExpiration, {
      userId: tokenEntity.user.id,
      role: tokenEntity.user.role,
    });
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
      this.accessTokenExpiration,
      {
        userId,
        role,
      },
    );

    const refreshToken = this.jwtHelper.generateToken(
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
}

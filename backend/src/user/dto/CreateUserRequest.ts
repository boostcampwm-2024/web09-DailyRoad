import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../entity/User';
import { UserInfoWithProvider } from '../user.type';
import { Role } from '../enum/Role';

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  oauthId: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  constructor(user: UserInfoWithProvider) {
    this.provider = user.provider;
    this.nickname = user.nickname;
    this.oauthId = user.oauthId;
    this.role = user.role;
    this.profileImageUrl = user.profileImageUrl;
  }

  toEntity(): User {
    return new User(
      this.provider,
      this.nickname,
      this.oauthId,
      this.role,
      this.profileImageUrl,
    );
  }
}

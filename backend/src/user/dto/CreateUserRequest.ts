import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../entity/user.entity';
import { userInfoWithProvider } from '../userType';

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

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  constructor(user: userInfoWithProvider) {
    this.provider = user.provider;
    this.nickname = user.name;
    this.oauthId = user.oauthId;
    this.role = user.role;
    this.profileImageUrl = user.picture;
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

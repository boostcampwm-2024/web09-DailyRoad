import { Module, Global } from '@nestjs/common';
import { AuthController } from '@src/auth/AuthController';
import { AuthService } from '@src/auth/AuthService';
import { UserModule } from '@src/user/UserModule';
import { JWTHelper } from '@src/auth/JWTHelper';
import { RefreshTokenRepository } from '@src/auth/RefreshTokenRepository';

@Global()
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JWTHelper, RefreshTokenRepository],
  exports: [JWTHelper],
})
export class AuthModule {}

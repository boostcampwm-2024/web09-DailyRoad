import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// Todo. 유저 기능 완성 후 교체
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}

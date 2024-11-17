import { Module } from '@nestjs/common';
import { AdminBannerModule } from './banner/banner.module';
import { RouterModule, APP_GUARD } from '@nestjs/core';
import { AdminGuard } from '@src/admin/guard/AdminGuard';
import { AuthModule } from '@src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    AdminBannerModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: 'banners',
            module: AdminBannerModule,
          },
        ],
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
})
export class AdminModule {}

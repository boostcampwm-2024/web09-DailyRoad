import { Module, UseGuards } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { AdminBannerModule } from '@src/admin/banner/BannerModule';
import { AdminGuard } from '@src/admin/guard/AdminGuard';
import { AuthModule } from '@src/auth/AuthModule';

@UseGuards(AdminGuard)
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
  providers: [AdminGuard],
  exports: [AdminGuard],
})
export class AdminModule {}

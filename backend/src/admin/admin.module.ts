import { Module, UseGuards } from '@nestjs/common';
import { AdminBannerModule } from './banner/banner.module';
import { RouterModule } from '@nestjs/core';
import { AdminGuard } from '@src/admin/guard/AdminGuard';
import { AuthModule } from '@src/auth/auth.module';

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

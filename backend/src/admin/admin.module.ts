import { Module } from '@nestjs/common';
import { AdminBannerModule } from './banner/banner.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
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
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { StorageController } from '@src/storage/StorageController';
import { StorageService } from '@src/storage/StorageService';

@Module({
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}

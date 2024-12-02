import { Module } from '@nestjs/common';
import { StorageController } from './StorageController';
import { StorageService } from './StorageService';

@Module({
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}

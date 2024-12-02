import { Module } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { BatchService } from '@src/batch/BatchService';
import { PlaceRepository } from '@src/place/PlaceRepository';
import { SearchModule } from '@src/search/SearchModule';

@Module({
  imports: [SearchModule],
  providers: [BatchService, PlaceRepository, PinoLogger],
})
export class BatchModule {}

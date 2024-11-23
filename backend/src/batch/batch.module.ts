import { Module } from '@nestjs/common';
import { BatchService } from '@src/batch/batch.service';
import { PinoLogger } from 'nestjs-pino';
import { PlaceRepository } from '@src/place/place.repository';
import { SearchModule } from '@src/search/search.module';

@Module({
  imports: [SearchModule],
  providers: [BatchService, PlaceRepository, PinoLogger],
})
export class BatchModule {}

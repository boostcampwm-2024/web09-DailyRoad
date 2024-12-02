import { forwardRef, Module } from '@nestjs/common';
import { PlaceController } from './PlaceController';
import { PlaceService } from './PlaceService';
import { PlaceRepository } from './PlaceRepository';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from '@src/search/SearchModule';
import { SearchService } from '@src/search/SearchService';
import { PinoLogger } from 'nestjs-pino';

@Module({
  imports: [ConfigModule, forwardRef(() => SearchModule)],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository, SearchService, PinoLogger],
  exports: [PlaceRepository],
})
export class PlaceModule {}

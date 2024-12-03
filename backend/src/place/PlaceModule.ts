import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { PlaceController } from '@src/place/PlaceController';
import { PlaceService } from '@src/place/PlaceService';
import { PlaceRepository } from '@src/place/PlaceRepository';
import { SearchModule } from '@src/search/SearchModule';
import { SearchService } from '@src/search/SearchService';

@Module({
  imports: [ConfigModule, forwardRef(() => SearchModule)],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository, SearchService, PinoLogger],
  exports: [PlaceService, PlaceRepository],
})
export class PlaceModule {}

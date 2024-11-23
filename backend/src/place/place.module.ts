import { forwardRef, Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceRepository } from './place.repository';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from '@src/search/search.module';
import { SearchService } from '@src/search/search.service';
import { PinoLogger } from 'nestjs-pino';

@Module({
  imports: [ConfigModule, forwardRef(() => SearchModule)],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository, SearchService, PinoLogger],
  exports: [PlaceRepository],
})
export class PlaceModule {}

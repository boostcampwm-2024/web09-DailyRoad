import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceRepository } from './place.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository],
  exports: [PlaceRepository],
})
export class PlaceModule {}

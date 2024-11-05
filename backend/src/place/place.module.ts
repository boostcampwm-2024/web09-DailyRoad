import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceRepository } from './place.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Place])],
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository],
})
export class PlaceModule {}

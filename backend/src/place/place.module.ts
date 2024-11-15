import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { PlaceRepositoryI } from './placeRepositoryI';
import { PlaceRepository } from './interface/PlaceRepository.interface';

@Module({
  controllers: [PlaceController],
  providers: [
    PlaceService,
    {
      provide: PlaceRepository,
      useClass: PlaceRepositoryI,
    },
  ],
  exports: [PlaceRepository],
})
export class PlaceModule {}

import { Module } from '@nestjs/common';
import { MapService } from '@src/map/MapService';
import { MapController } from '@src/map/MapController';
import { MapRepository } from '@src/map/MapRepository';
import { UserModule } from '@src/user/UserModule';
import { PlaceModule } from '@src/place/PlaceModule';

@Module({
  imports: [UserModule, PlaceModule],
  controllers: [MapController],
  providers: [MapService, MapRepository],
})
export class MapModule {}

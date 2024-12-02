import { Module } from '@nestjs/common';
import { MapService } from './MapService';
import { MapController } from './MapController';
import { UserModule } from '../user/UserModule';
import { MapRepository } from './MapRepository';
import { PlaceModule } from '../place/PlaceModule';

@Module({
  imports: [UserModule, PlaceModule],
  controllers: [MapController],
  providers: [MapService, MapRepository],
})
export class MapModule {}

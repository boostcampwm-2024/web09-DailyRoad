import { Module } from '@nestjs/common';
import { MapService } from './map.service';
import { MapController } from './map.controller';
import { UserModule } from '../user/user.module';
import { MapRepository } from './map.repository';
import { PlaceModule } from '../place/place.module';

@Module({
  imports: [UserModule, PlaceModule],
  controllers: [MapController],
  providers: [MapService, MapRepository],
})
export class MapModule {}

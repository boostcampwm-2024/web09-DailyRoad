import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { MapService } from '@src/map/MapService';
import { MapPermissionException } from '@src/map/exception/MapPermissionException';

@Injectable()
export class MapPermissionGuard implements CanActivate {
  constructor(private readonly mapService: MapService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const mapId = Number(request.params.id);
    const userId = Number(request.user.userId);

    const map = await this.mapService.getMapById(mapId);
    if (map.user.id !== userId) {
      throw new MapPermissionException(mapId);
    }
    return true;
  }
}

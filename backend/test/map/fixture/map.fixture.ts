import { MapFixtureType } from './map.fixture.type';
import { Map } from '@src/map/entity/map.entity';

export class MapFixture {
  static createMap = ({
    user,
    title = 'Map For Test',
    isPublic = true,
    thumbnailUrl = 'https://example.com/map_for_test.jpg',
    description = 'A sample map with popular places',
  }: MapFixtureType) => {
    return new Map(user, title, isPublic, thumbnailUrl, description);
  };
}

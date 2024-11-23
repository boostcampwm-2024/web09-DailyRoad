import { User } from '@src/user/entity/user.entity';
import { MapFixture } from '@test/map/fixture/map.fixture';
import { PlaceFixture } from '@test/place/fixture/place.fixture';

export function createPublicMaps(count: number, user: User) {
  const maps = [];
  for (let i = 1; i <= count + 1; i++) {
    const map = MapFixture.createMap({
      user: user,
      title: `public test map ${i}`,
    });
    maps.push(map);
  }
  return maps;
}

export function createPrivateMaps(count: number, user: User) {
  const maps = [];
  for (let i = 1; i <= count + 1; i++) {
    const map = MapFixture.createMap({
      user: user,
      title: `private test map ${i}`,
      isPublic: false,
    });
    maps.push(map);
  }
  return maps;
}

export function createPublicMapsWithTitle(
  count: number,
  user: User,
  title: string,
) {
  const maps = [];
  for (let i = 1; i <= count + 1; i++) {
    const map = MapFixture.createMap({
      user: user,
      title: `${title} ${i}`,
    });
    maps.push(map);
  }
  return maps;
}

export function createPlace(count: number) {
  const places = [];
  for (let i = 1; i <= count + 1; i++) {
    const place = PlaceFixture.createPlace({
      googlePlaceId: `google_place_${i}`,
    });
    places.push(place);
  }
  return places;
}

import { User } from '@src/user/entity/user.entity';
import { MapFixture } from '@test/map/fixture/map.fixture';
import { PlaceFixture } from '@test/place/fixture/place.fixture';
import { Map } from '@src/map/entity/map.entity';

function createEntities<T>(
  createFn: (index: number, ...args: any[]) => T,
  quantity: number,
  ...args: any[]
): T[] {
  return Array.from({ length: quantity }, (_, i) => createFn(i + 1, ...args));
}

function createMapWithOptions(
  index: number,
  user: User,
  options: Partial<Map> = {},
): Map {
  return MapFixture.createMap({
    user,
    title: `test map ${index}`,
    isPublic: true,
    ...options,
  });
}

export function createPublicMaps(quantity: number, user: User) {
  return createEntities((i) => createMapWithOptions(i, user), quantity);
}

export const createPrivateMaps = (count: number, user: User) => {
  return createEntities(
    (i) =>
      createMapWithOptions(i, user, {
        isPublic: false,
        title: `private test map ${i}`,
      }),
    count,
  );
};

export const createPlace = (quantity: number) => {
  return createEntities(
    (i) => PlaceFixture.createPlace({ googlePlaceId: `google_place_${i}` }),
    quantity,
  );
};
export const createPublicMapsWithTitle = (
  quantity: number,
  user: User,
  baseTitle: string,
) => {
  return createEntities(
    (i) => createMapWithOptions(i, user, { title: `${baseTitle} ${i}` }),
    quantity,
  );
};

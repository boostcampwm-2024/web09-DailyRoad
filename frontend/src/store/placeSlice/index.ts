import { StateCreator } from 'zustand';

import { Place, StoreState } from '@/types';

export type PlaceState = {
  place: Place;
  places: Place[];
  setPlace: (place: Place) => void;
  setPlaces: (places: Place[]) => void;
};

export const createPlaceSlice: StateCreator<StoreState, [], [], PlaceState> = (
  set,
) => ({
  place: {} as Place,
  places: [],
  setPlace: (place: Place) => set({ place }),
  setPlaces: (places: Place[]) => set({ places }),
});

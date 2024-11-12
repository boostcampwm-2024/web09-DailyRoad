import { Place, StoreState } from '@/types';
import { StateCreator } from 'zustand';

export type PlaceState = {
  place: Place;
  places: Place[];
  setPlace: (place: Place) => void;
  setPlaces: (places: Place[]) => void;
};

export const createPlaceSlice: StateCreator<StoreState, [], [], PlaceState> = (
  set,
  get,
) => ({
  place: {} as Place,
  places: [],
  setPlace: (place: Place) => set({ place }),
  setPlaces: (places: Place[]) => set({ places }),
});

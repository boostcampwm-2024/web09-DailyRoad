import { create } from 'zustand';
import { StoreState } from '@/types';
import { createGoogleMapSlice } from '@/store/googleMapSlice';
import { createPlaceSlice } from '@/store/placeSlice';

export const useStore = create<StoreState>()((...a) => ({
  ...createGoogleMapSlice(...a),
  ...createPlaceSlice(...a),
}));

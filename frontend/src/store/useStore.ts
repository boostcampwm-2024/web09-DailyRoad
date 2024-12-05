import { create } from 'zustand';

import { createGoogleMapSlice } from '@/store/googleMapSlice';
import { createPlaceSlice } from '@/store/placeSlice';
import { createToastSlice } from './toastSlice';
import { createAuthSlice } from './userSlice';

import { StoreState } from '@/types';

export const useStore = create<StoreState>()((...a) => ({
  ...createGoogleMapSlice(...a),
  ...createPlaceSlice(...a),
  ...createToastSlice(...a),
  ...createAuthSlice(...a),
}));

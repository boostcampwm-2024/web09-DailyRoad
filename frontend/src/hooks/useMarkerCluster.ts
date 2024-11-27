import { useStore } from '@/store/useStore';

export const useMarkerCluster = () => {
  const map = useStore((state) => state.googleMap);
  const markers = useStore((state) => state.markers);
};

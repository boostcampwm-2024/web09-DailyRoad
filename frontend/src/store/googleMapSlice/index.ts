import { Loader } from '@googlemaps/js-api-loader';
import { INITIAL_MAP_CONFIG } from '@/constants/map';
import { StateCreator } from 'zustand';
import { StoreState } from '@/types';

export type GoogleMapState = {
  googleMap: google.maps.Map | null;
  markerLibrary: google.maps.MarkerLibrary | null;
  setGoogleMap: (map: google.maps.Map) => void;
  initializeMap: (container: HTMLElement) => void;
  moveTo: (lat: number, lng: number) => void;
  fetchPlacePhotos: (placeId: string) => void;
};

export const createGoogleMapSlice: StateCreator<
  StoreState,
  [],
  [],
  GoogleMapState
> = (set, get) => ({
  googleMap: null,
  markerLibrary: null,

  setGoogleMap: (map: google.maps.Map) => set({ googleMap: map }),

  initializeMap: async (container: HTMLElement) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API 키가 설정되지 않았습니다.');
    }
    const loader = new Loader({
      apiKey: apiKey,
      version: '3.58',
      libraries: ['places'],
    });

    try {
      await loader.load();

      const { Map: GoogleMap } = (await google.maps.importLibrary(
        'maps',
      )) as google.maps.MapsLibrary;

      const markerLibrary = (await google.maps.importLibrary(
        'marker',
      )) as google.maps.MarkerLibrary;

      const map = new GoogleMap(container, INITIAL_MAP_CONFIG);
      set({ googleMap: map, markerLibrary });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to load Google Maps API');
    }
  },

  moveTo: (lat: number, lng: number) => {
    const map = get().googleMap;
    if (map) {
      map.panTo({ lat, lng });
      map.setZoom(14);
    }
  },
  fetchPlacePhotos: (placeId: string) => {
    const map = get().googleMap;
    if (!map) {
      console.error('Map is not initialized.');
      return;
    }

    const service = new google.maps.places.PlacesService(map);

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId: placeId,
      fields: ['photos'], // 필요한 필드 지정
    };

    service.getDetails(request, (place, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        place?.photos
      ) {
        const photos = place.photos;
        photos.forEach((photo, index) => {
          const imgUrl = photo.getUrl({ maxWidth: 400, maxHeight: 400 });
          // 이미지 URL을 이용해 이미지를 표시하거나 처리
          console.log(`Photo ${index + 1}:`, imgUrl);

          // 예: 이미지 요소 생성 및 추가 (적절한 컨테이너에 추가)
          const img = document.createElement('img');
          img.src = imgUrl;
          img.alt = `Place Photo ${index + 1}`;
          img.style.margin = '5px';
          // 예시로 document.body에 추가 (실제 사용 시 적절한 위치에 추가)
          document.body.appendChild(img);
        });
      } else {
        console.error('Place details 요청 실패:', status);
      }
    });
  },
});

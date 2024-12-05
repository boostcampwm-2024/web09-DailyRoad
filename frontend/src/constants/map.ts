import { MarkerColor } from '@/types';

const INITIAL_CENTER = {
  lat: 37.49084668,
  lng: 127.0334308656,
};
const INITIAL_ZOOM_LEVEL = 18;

export const INITIAL_MAP_CONFIG = {
  center: INITIAL_CENTER,
  zoom: INITIAL_ZOOM_LEVEL,
  disableDefaultUI: true,
  mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
  clickableIcons: false,
  minZoom: 8,
  maxZoom: 18,
  gestureHandling: 'greedy',
  restriction: {
    latLngBounds: {
      north: 39,
      south: 32,
      east: 132,
      west: 124,
    },
    strictBounds: true,
  },
};

export const VISIBILITY_TEXTS = {
  title: '공개 범위',
  description: '공개 여부를 선택해주세요',
  public: {
    label: '공개',
    description: '나의 지도를 다른 사람들과 공유할 수 있습니다.',
  },
  private: {
    label: '비공개',
    description: '나의 지도를 나만 볼 수 있습니다.',
  },
} as const;

export const MARKER_COLORS: MarkerColor[] = [
  'RED',
  'ORANGE',
  'YELLOW',
  'GREEN',
  'BLUE',
  'PURPLE',
] as const;

export const markerBgColor: { [K in MarkerColor]: string } = {
  RED: 'bg-c_marker_RED',
  ORANGE: 'bg-c_marker_ORANGE',
  YELLOW: 'bg-c_marker_YELLOW',
  GREEN: 'bg-c_marker_GREEN',
  BLUE: 'bg-c_marker_BLUE',
  PURPLE: 'bg-c_marker_PURPLE',
};
export const markerBorderColor: { [K in MarkerColor]: string } = {
  RED: 'border-c_marker_RED',
  ORANGE: 'border-c_marker_ORANGE',
  YELLOW: 'border-c_marker_YELLOW',
  GREEN: 'border-c_marker_GREEN',
  BLUE: 'border-c_marker_BLUE',
  PURPLE: 'border-c_marker_PURPLE',
};

export const markerIcon = {
  MAP: () => {},
};

export const GOOGLE_ELEMENTS = {
  COURSE_MARKER: (order: number) => `
      <svg width="36" height="36" viewBox="0 0 61 74" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.86668 52.3259C-2.95556 40.3556 -2.95556 20.948 8.86668 8.97771C20.6889 -2.99257 39.8565 -2.99257 51.6788 8.97771C63.501 20.948 63.501 40.3556 51.6788 52.3259L30.2727 74L8.86668 52.3259Z" fill="#00A3FF"/>
<circle cx="30.3031" cy="30.1928" r="18.8988" fill="white"/>
<text x=30 y=40 font-size=25 text-anchor="middle" fill="#00A3FF" font-weight="bold">${order}</text> 
</svg>
    `,
  MAP_MARKER: (categoryCode: string, color: string | undefined) =>
    `<img width='36' height='36' src="https://kr.object.ncloudstorage.com/ogil-public/uploads/marker/${categoryCode ?? 'pin'}_${color ?? 'default'}.png" style="filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.5));"/>`,
  INFO_WINDOW: (
    title: string,
    category: string | undefined,
    categoryCode: string,
    address: string,
    description: string,
  ) => `<div style="padding:4px; padding-right: 30px; font-family: Pretendard, ui-sans-serif, system-ui;">
    <div style=" display:flex; flex-direction:column; gap:0.25rem; ">
        <p style="font-size:16px; font-weight:700">${title}</p>
        <p class="${categoryCode} badge">${category ?? '장소'}</p>  
        <p>${address ?? '주소 없음'}</p>
        </div>
        <p>${description ?? ''}</p>
  </div>`,
};
export const CATEGORY_LIST = {
  명소: 'camera',
  맛집: 'restaurant',
  음식점: 'restaurant',
  카페: 'cafe',
  기본: 'pin',
  숙소: 'pin',
};

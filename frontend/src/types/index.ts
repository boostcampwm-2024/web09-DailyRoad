import { GoogleMapState } from '@/store/googleMapSlice';
import { PlaceState } from '@/store/placeSlice';

export type Place = {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  google_place_id: string;
  detail_page_url: string;
  thumbnail_url: string;
  rating: number;
  formed_address: string;
  category?: string;
};

export type Map = {
  id: number;
  author: User;
  thumbnail_url: string;
  title: string;
  description: string;
  places: Place[];
};

export type MapList = {
  maps: MapItemType[];
  totalPages: number;
  currentPage: number;
};

export type CreateMapType = 'MAP' | 'COURSE';

export type BaseMap = {
  title: string;
  thumbnailUrl?: string;
  description: string;
  isPublic: boolean;
  mode: CreateMapType;
};

export type MapItemType = {
  id: number;
  user: User;
  title: string;
  isPublic: boolean;
  thumbnailUrl: string;
  description: string;
  pinCount: number;
  createdAt: string;
};

export type User = {
  id: number;
  nickname: string;
  profile_url: string;
};

export type MarkerColor =
  | 'RED'
  | 'ORANGE'
  | 'YELLOW'
  | 'GREEN'
  | 'BLUE'
  | 'PURPLE';
export type MarkerCategory =
  | 'restaurant'
  | 'cafe'
  | 'attraction'
  | string
  | undefined;

export type PlaceMarker = {
  placeId: number;
  color: MarkerColor;
  category: MarkerCategory;
};

export type CustomPlace = {
  placeId: number;
  color: MarkerColor;
  comment: string;
};

export type PreSignedURLResponse = {
  fields: {
    'Content-Type': string;
    Policy: string;
    'X-Amz-Algorithm': string;
    'X-Amz-Credential': string;
    'X-Amz-Date': string;
    'X-Amz-Signature': string;
    acl: string;
    bucket: string;
    key: string;
  };
  uploadedUrl: string;
  url: string;
};

export type StoreState = GoogleMapState & PlaceState;

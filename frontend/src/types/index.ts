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
};

export type MapType = {
  id: number;
  author: User;
  thumbnail_url: string;
  title: string;
  description: string;
  places: Place[];
};

export type CreateMapType = 'MAP' | 'COURSE';

export type BaseMapType = {
  title: string;
  thumbnailUrl?: string;
  description: string;
  isPublic: boolean;
};

export type MapItemType = {
  id: number;
  title: string;
  description: string;
  pin_count: number;
};

export type User = {
  id: number;
  nickname: string;
  profile_url: string;
};

export type PlaceMarker = {
  latitude: number;
  longitude: number;
  placeId: number;
  color: string;
  category: string;
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

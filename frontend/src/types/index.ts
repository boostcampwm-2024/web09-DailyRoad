export type Place = {
  id: number;
  name: string;
  location: {
    lat: -33.866489;
    lng: 151.1958561;
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

export type BaseMapType = {
  title: string;
  thumbnailUrl: string;
  description: string;
  isPublic: boolean;
};

export type User = {
  id: number;
  nickname: string;
  profile_url: string;
};

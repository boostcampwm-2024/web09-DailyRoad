export type PlaceSearchHit = {
  _index: string;
  _id: string;
  _score: number;
  _source: {
    id: string;
    name: string;
    location: {
      lat: number;
      long: number;
    };
    googlePlaceId: string;
    category: string | null;
    description: string;
    detailPageUrl: string;
    thumbnailUrl: string;
    rating: number;
    formattedAddress: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
};

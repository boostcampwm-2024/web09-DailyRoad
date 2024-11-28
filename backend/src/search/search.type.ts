export type PlaceSearchHit = {
  _index: string;
  _id: string;
  _score: number;
  _source: {
    id: string;
    name: string;
    location: {
      lat: number;
      lon: number;
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

export type PlaceAutocompleteSource = {
  name: string;
  formattedAddress: string;
};

export type SearchCompletionSuggestOption<TDocument> = {
  text: string;
  _index: string;
  _type?: string;
  _id: string;
  _score: number;
  _source?: TDocument;
};

export function isCompletionSuggest<TDocument>(
  options: any,
): options is SearchCompletionSuggestOption<TDocument>[] {
  return Array.isArray(options);
}

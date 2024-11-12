import { getPlace } from '@/api/place';
import React from 'react';
import { Place } from '@/types';
import PlaceItem from './PlaceItem';
import Marker from '@/components/Marker/Marker';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

type SearchResultsProps = {
  query: string;
};

const SearchResults = ({ query }: SearchResultsProps) => {
  const { ref, data, isFetchingNextPage, hasNextPage } = useInfiniteScroll<
    Place[]
  >({
    queryKey: 'placeSearch',
    query: query,
    queryFn: ({ pageParam }) => getPlace(query, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.length > 4 ? lastPage.length : undefined;
    },
  });

  const isEmpty = !data?.pages || data.pages.every((page) => page.length === 0);

  return (
    <div className="max-h-[600px] flex-grow">
      {query && <p className="text-base">"{query}"에 대한 검색결과</p>}
      {!isEmpty ? (
        <div className="scrollbar- flex max-h-[600px] flex-col space-y-4 overflow-y-auto">
          {data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.map((place: Place) => (
                <>
                  <PlaceItem key={place.id} place={place} />
                  <Marker
                    key={place.google_place_id}
                    position={place.location}
                  />
                </>
              ))}
            </React.Fragment>
          ))}
          <div ref={ref} className="h-1" />
        </div>
      ) : (
        <div className="flex h-44 items-center justify-center">
          <p className="text-lg text-c_button_gray">검색 결과 없음</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

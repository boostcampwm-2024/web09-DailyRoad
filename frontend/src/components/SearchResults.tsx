import { getPlace } from '@/api/place';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import React, { useEffect } from 'react';
import { Place } from '@/types';
import PlaceItem from './Place/PlaceItem';
import Marker from './Marker/Marker';

type SearchResultsProps = {
  query: string;
};

const SearchResults = ({ query }: SearchResultsProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['placeSearch', query],
      queryFn: ({ pageParam = 1 }) => getPlace(query, pageParam),
      initialPageParam: 1,
      getNextPageParam: (
        lastPage: string | any[],
        allPages: string | any[],
      ) => {
        return lastPage.length > 3 ? allPages.length + 1 : undefined;
      },
      enabled: !!query,
    });

  const { ref, inView } = useInView({ threshold: 1.0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <h3 className="mb-4 text-xl font-bold">"{query}"에 대한 검색결과</h3>
      <div className="scrollbar-thumb-rounded flex max-h-[600px] flex-col space-y-4 overflow-y-auto scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500">
        {data?.pages.map((page, index) => (
          <React.Fragment key={index}>
            {page.map((place: Place) => (
              <>
                <PlaceItem key={place.id} place={place} />
                <Marker key={place.id} position={place.location} />
              </>
            ))}
          </React.Fragment>
        ))}
        <div ref={ref} className="h-1" />
      </div>
      {isFetchingNextPage && <p className="mt-4">Loading more...</p>}
      {!hasNextPage && <p className="mt-4">모든 결과 표시 완료</p>}
    </>
  );
};

export default SearchResults;

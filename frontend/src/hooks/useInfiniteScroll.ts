import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

type InfiniteScrollOptions<TQueryFnData> = {
  queryKey: string;
  query?: string;
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<TQueryFnData>;
  getNextPageParam: (
    lastPage: TQueryFnData,
    allPages: TQueryFnData[],
  ) => number | undefined;
  threshold?: number;
};

export const useInfiniteScroll = <TQueryFnData>({
  queryKey,
  query,
  queryFn,
  getNextPageParam,
  threshold = 1.0,
}: InfiniteScrollOptions<TQueryFnData>) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<TQueryFnData>({
      queryKey: [queryKey, query],
      queryFn: ({ pageParam = 1 }) =>
        queryFn({ pageParam: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam,
      enabled: !!query,
    });

  const { ref, inView } = useInView({ threshold });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { ref, data, isFetchingNextPage, hasNextPage };
};

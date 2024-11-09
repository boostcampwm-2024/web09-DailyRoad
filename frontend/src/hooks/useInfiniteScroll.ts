import { useInfiniteQuery, QueryKey } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

type InfiniteScrollOptions<TQueryFnData, TData = TQueryFnData> = {
  queryKey: QueryKey;
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<TQueryFnData>;
  getNextPageParam: (
    lastPage: TQueryFnData,
    allPages: TQueryFnData[],
  ) => number | undefined;
  threshold?: number;
};

export const useInfiniteScroll = <TQueryFnData, TData = TQueryFnData>({
  queryKey,
  queryFn,
  getNextPageParam,
  threshold = 1.0,
}: InfiniteScrollOptions<TQueryFnData, TData>) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<TQueryFnData, unknown, TData>({
      queryKey,
      queryFn: ({ pageParam = 1 }) =>
        queryFn({ pageParam: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam,
    });

  const { ref, inView } = useInView({ threshold });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { ref, data, isFetchingNextPage, hasNextPage };
};

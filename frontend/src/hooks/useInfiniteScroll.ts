import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef } from 'react';
import { throttle } from 'lodash';

/**
 * todo:
 * 에러 발생 시 재시도 설정
 * 데이터 캐싱 전략 검토
 * 스크롤 위치 복원 로직 추가
 */

type InfiniteScrollOptions<TQueryFnData> = {
  queryKey: string[];
  query?: string;
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<TQueryFnData>;
  getNextPageParam: (
    lastPage: TQueryFnData,
    allPages: TQueryFnData[],
  ) => number | undefined;
  threshold?: number;
  fetchWithoutQuery?: boolean;
};

export const useInfiniteScroll = <TQueryFnData>({
  queryKey,
  query,
  queryFn,
  getNextPageParam,
  threshold = 0.5,
  fetchWithoutQuery = false,
}: InfiniteScrollOptions<TQueryFnData>) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<TQueryFnData>({
      queryKey: [...queryKey, query] as const,
      queryFn: ({ pageParam = 1 }) =>
        queryFn({ pageParam: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam,
      enabled: Boolean(query) || fetchWithoutQuery,
    });

  const { ref, inView } = useInView({ threshold });

  const throttledFetchNextPage = useRef(
    throttle(() => {
      fetchNextPage();
    }, 500),
  ).current;

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      throttledFetchNextPage();
    }
    return () => {
      throttledFetchNextPage.cancel();
    };
  }, [inView, throttledFetchNextPage]);

  return { ref, data, isFetchingNextPage, hasNextPage };
};

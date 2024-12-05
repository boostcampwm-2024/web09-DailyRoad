import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMap } from '@/api/map';
import { createCourse } from '@/api/course';
import { CustomError } from '@/api/CustomError';
import { QUERY_KEY } from '@/constants/api';

import { useStore } from '@/store/useStore';
import { CreateMapType } from '@/types';

export const useAddMapMutation = (mode: CreateMapType) => {
  const queryClient = useQueryClient();
  const addToast = useStore((state) => state.addToast);

  const mutationFn = mode === 'MAP' ? createMap : createCourse;
  const mapTypeQueryKey = mode === 'MAP' ? QUERY_KEY.MAPS : QUERY_KEY.COURSES;
  const rangeTypeQueryKey =
    mode === 'MAP' ? QUERY_KEY.MY_MAPS : QUERY_KEY.MY_COURSES;

  const addMapMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mapTypeQueryKey });
      queryClient.invalidateQueries({ queryKey: rangeTypeQueryKey });
    },
    onError: (error: CustomError) => {
      addToast(error.userMessage, '', 'error');
    },
  });

  return addMapMutation;
};

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { putPlaceToCourse } from '@/api/place';
import { CustomError } from '@/api/CustomError';
import { QUERY_KEY } from '@/constants/api';

import { useStore } from '@/store/useStore';

export const usePutPlaceToCourseMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useStore((state) => state.addToast);

  const putPlaceToCourseMutation = useMutation({
    mutationFn: putPlaceToCourse,
    onSuccess: (data) => {
      const id = data?.id;
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.COURSE(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.COURSES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.MY_COURSES });
    },
    onError: (error: CustomError) => {
      addToast(error.userMessage, '', 'error');
    },
  });

  return putPlaceToCourseMutation;
};

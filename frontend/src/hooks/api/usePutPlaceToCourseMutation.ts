import { CustomError } from '@/api/CustomError';
import { putPlaceToCourse } from '@/api/place';
import { useStore } from '@/store/useStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePutPlaceToCourseMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useStore((state) => state.addToast);

  const putPlaceToCourseMutation = useMutation({
    mutationFn: putPlaceToCourse,
    onSuccess: (data) => {
      const id = data?.id;
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      queryClient.invalidateQueries({ queryKey: ['courseList'] });
    },
    onError: (error: CustomError) => {
      addToast(error.userMessage, '', 'error');
    },
  });

  return putPlaceToCourseMutation;
};

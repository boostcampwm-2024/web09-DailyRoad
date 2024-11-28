import { putPlaceToCourse } from '@/api/place';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePutPlaceToCourseMutation = () => {
  const queryClient = useQueryClient();

  const putPlaceToCourseMutation = useMutation({
    mutationFn: putPlaceToCourse,
    onSuccess: (data) => {
      const id = data?.id;
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
  });

  return putPlaceToCourseMutation;
};

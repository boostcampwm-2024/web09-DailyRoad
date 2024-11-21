import { addPlaceToCourse, addPlaceToMap } from '@/api/place';
import { CreateMapType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddPlaceToCourseMutation = () => {
  const queryClient = useQueryClient();

  const addPlaceToCourseMutation = useMutation({
    mutationFn: addPlaceToCourse,
    onSuccess: (data) => {
      const id = data?.id;
      queryClient.invalidateQueries({ queryKey: ['course', id] });
    },
  });

  return addPlaceToCourseMutation;
};

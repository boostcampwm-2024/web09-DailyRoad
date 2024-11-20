import { deletePlaceToCourse, deletePlaceToMap } from '@/api/place';
import { CreateMapType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useDeletePlaceMutation = (mode: CreateMapType) => {
  const queryClient = useQueryClient();

  const mutationFn = mode === 'MAP' ? deletePlaceToMap : deletePlaceToCourse;
  const queryKey = mode === 'MAP' ? 'map' : 'course';

  const deleteMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: (data) => {
      const id = data?.id;
      queryClient.invalidateQueries({ queryKey: [queryKey, id] });
    },
  });
  return deleteMutation;
};

export default useDeletePlaceMutation;

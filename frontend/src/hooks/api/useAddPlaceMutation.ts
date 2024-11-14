import { addPlaceToCourse, addPlaceToMap } from '@/api/place';
import { CreateMapType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddPlaceMutation = (mode: CreateMapType) => {
  const queryClient = useQueryClient();
  const mutationFn = mode === 'MAP' ? addPlaceToMap : addPlaceToCourse;

  const addPlaceMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: (data) => {
      const placeId = data?.placeId;
      const id = data?.id;
      queryClient.invalidateQueries({ queryKey: ['places', id, placeId] });
    },
  });

  return addPlaceMutation;
};

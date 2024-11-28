import { addPlaceToMap } from '@/api/place';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddPlaceMutation = () => {
  const queryClient = useQueryClient();

  const addPlaceMutation = useMutation({
    mutationFn: addPlaceToMap,
    onSuccess: (data) => {
      const id = data?.id;
      queryClient.invalidateQueries({ queryKey: ['map', id] });
      queryClient.invalidateQueries({ queryKey: ['mapList'] });
    },
  });

  return addPlaceMutation;
};

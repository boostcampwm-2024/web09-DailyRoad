import { CustomError } from '@/api/CustomError';
import { addPlaceToMap } from '@/api/place';
import { useStore } from '@/store/useStore';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddPlaceMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useStore((state) => state.addToast);

  const addPlaceMutation = useMutation({
    mutationFn: addPlaceToMap,
    onSuccess: (data) => {
      const id = data?.id;
      queryClient.invalidateQueries({ queryKey: ['map', id] });
      queryClient.invalidateQueries({ queryKey: ['mapList'] });
    },
    onError: (error: CustomError) => {
      addToast(error.userMessage, '', 'error');
    },
  });

  return addPlaceMutation;
};

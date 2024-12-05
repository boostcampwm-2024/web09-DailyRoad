import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addPlaceToMap } from '@/api/place';
import { CustomError } from '@/api/CustomError';
import { QUERY_KEY } from '@/constants/api';

import { useStore } from '@/store/useStore';

export const useAddPlaceMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useStore((state) => state.addToast);

  const addPlaceMutation = useMutation({
    mutationFn: addPlaceToMap,
    onSuccess: (data) => {
      const id = data?.id;
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.MAP(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.MAPS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.MY_MAPS });
    },
    onError: (error: CustomError) => {
      addToast(error.userMessage, '', 'error');
    },
  });

  return addPlaceMutation;
};

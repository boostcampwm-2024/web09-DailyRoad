import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CustomError } from '@/api/CustomError';
import { editMap } from '@/api/map';

import { useStore } from '@/store/useStore';
import { QUERY_KEY } from '@/constants/api';

export const useEditMapMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useStore((state) => state.addToast);

  const editMapMutation = useMutation({
    mutationFn: editMap,
    onSuccess: (data) => {
      const mapId = data?.id;
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.MAP(mapId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.MAPS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.MY_MAPS });
    },
    onError: (error: CustomError) => {
      addToast(error.userMessage, '', 'error');
    },
  });

  return editMapMutation;
};

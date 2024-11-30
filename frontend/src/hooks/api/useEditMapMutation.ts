import { CustomError } from '@/api/CustomError';
import { editMap } from '@/api/map';
import { useStore } from '@/store/useStore';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEditMapMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useStore((state) => state.addToast);

  const editMapMutation = useMutation({
    mutationFn: editMap,
    onSuccess: (data) => {
      const mapId = data?.id;
      queryClient.invalidateQueries({ queryKey: ['map', mapId] });
      queryClient.invalidateQueries({ queryKey: ['mapList'] });
    },
    onError: (error: CustomError) => {
      addToast(error.userMessage, '', 'error');
    },
  });

  return editMapMutation;
};

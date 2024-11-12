import { createMap } from '@/api/map';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddMapMutation = () => {
  const queryClient = useQueryClient();

  const addMapMutation = useMutation({
    mutationFn: createMap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maps'] });
    },
  });

  return addMapMutation;
};

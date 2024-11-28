import { editMap } from '@/api/map';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEditMapMutation = () => {
  const queryClient = useQueryClient();

  const editMapMutation = useMutation({
    mutationFn: editMap,
    onSuccess: (data) => {
      const mapId = data?.id;
      queryClient.invalidateQueries({ queryKey: ['map', mapId] });
      queryClient.invalidateQueries({ queryKey: ['mapList'] });
    },
  });

  return editMapMutation;
};

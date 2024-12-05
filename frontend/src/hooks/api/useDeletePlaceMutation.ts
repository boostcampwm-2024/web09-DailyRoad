import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePlaceToMap } from '@/api/place';
import { QUERY_KEY } from '@/constants/api';

const useDeletePlaceMutation = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deletePlaceToMap,
    onSuccess: (data) => {
      const id = data?.id;
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.MAP(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.MAPS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.MY_MAPS });
    },
  });
  return deleteMutation;
};

export default useDeletePlaceMutation;

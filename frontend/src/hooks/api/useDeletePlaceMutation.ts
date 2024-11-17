import { deletePlaceToMap } from '@/api/place';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useDeletePlaceMutation = () => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deletePlaceToMap,
    onSuccess: (data) => {
      const id = data?.id;
      queryClient.invalidateQueries({ queryKey: ['map', id] });
    },
  });
  return deleteMutation;
};

export default useDeletePlaceMutation;

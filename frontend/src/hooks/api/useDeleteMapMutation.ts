import { deleteMap } from '@/api/map';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useDeleteMapMutation = () => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteMap,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maps'] });
    },
  });
  return deleteMutation;
};

export default useDeleteMapMutation;

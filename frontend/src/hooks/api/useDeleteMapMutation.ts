import { deleteCourse } from '@/api/course';
import { deleteMap } from '@/api/map';
import { CreateMapType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useDeleteMapMutation = (mode: CreateMapType) => {
  const queryClient = useQueryClient();

  const mutationFn = mode === 'MAP' ? deleteMap : deleteCourse;
  const queryKey = mode === 'MAP' ? 'maps' : 'courses';

  const deleteMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
  return deleteMutation;
};

export default useDeleteMapMutation;

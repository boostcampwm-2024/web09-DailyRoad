import { deleteCourse } from '@/api/course';
import { CustomError } from '@/api/CustomError';
import { deleteMap } from '@/api/map';
import { useStore } from '@/store/useStore';
import { CreateMapType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useDeleteMapMutation = (mode: CreateMapType) => {
  const queryClient = useQueryClient();
  const addToast = useStore((state) => state.addToast);

  const mutationFn = mode === 'MAP' ? deleteMap : deleteCourse;
  const queryKey = mode === 'MAP' ? 'mapList' : 'courseList';

  const deleteMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error: CustomError) => {
      addToast(error.userMessage, '', 'error');
    },
  });
  return deleteMutation;
};

export default useDeleteMapMutation;

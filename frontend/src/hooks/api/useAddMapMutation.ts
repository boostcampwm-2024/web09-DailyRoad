import { createCourse } from '@/api/course';
import { CustomError } from '@/api/CustomError';
import { createMap } from '@/api/map';
import { useStore } from '@/store/useStore';
import { CreateMapType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddMapMutation = (mode: CreateMapType) => {
  const queryClient = useQueryClient();
  const addToast = useStore((state) => state.addToast);

  const mutationFn = mode === 'MAP' ? createMap : createCourse;
  const queryKey = mode === 'MAP' ? 'mapList' : 'courseList';

  const addMapMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error: CustomError) => {
      addToast(error.userMessage, '', 'error');
    },
  });

  return addMapMutation;
};

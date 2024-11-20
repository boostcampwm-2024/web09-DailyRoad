import { createCourse } from '@/api/course';
import { createMap } from '@/api/map';
import { CreateMapType } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddMapMutation = (mode: CreateMapType) => {
  const queryClient = useQueryClient();

  const mutationFn = mode === 'MAP' ? createMap : createCourse;
  const queryKey = mode === 'MAP' ? 'maps' : 'courses';

  const addMapMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });

  return addMapMutation;
};

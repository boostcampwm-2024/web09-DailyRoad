import { useMutation, useQueryClient } from '@tanstack/react-query';

import { editCourse } from '@/api/course';
import { QUERY_KEY } from '@/constants/api';
import { CustomError } from '@/api/CustomError';

import { useStore } from '@/store/useStore';

export const useEditCourseMutation = () => {
  const queryClient = useQueryClient();
  const addToast = useStore((state) => state.addToast);

  const addMapMutation = useMutation({
    mutationFn: editCourse,
    onSuccess: (data) => {
      const courseId = data?.id;
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.COURSE(courseId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.COURSES });
    },
    onError: (error: CustomError) => {
      addToast(error.userMessage, '', 'error');
    },
  });

  return addMapMutation;
};

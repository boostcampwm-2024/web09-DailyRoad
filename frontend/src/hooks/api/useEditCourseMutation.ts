import { editCourse } from '@/api/course';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEditCourseMutation = () => {
  const queryClient = useQueryClient();

  const addMapMutation = useMutation({
    mutationFn: editCourse,
    onSuccess: (data) => {
      const courseId = data?.id;
      queryClient.invalidateQueries({ queryKey: ['course', courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return addMapMutation;
};

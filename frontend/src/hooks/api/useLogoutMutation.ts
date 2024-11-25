import { useStore } from '@/store/useStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteLogOut } from '@/api/auth';

export const useLogOutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const addToast = useStore((state) => state.addToast);
  const logout = useStore((state) => state.logOut);

  const logOutMutation = useMutation({
    mutationFn: deleteLogOut,
    onSuccess: () => {
      localStorage.removeItem(`ACCESS_TOKEN_KEY`);
      queryClient.clear();
      logout();
      navigate('/');
    },
    onError: () => {
      addToast('로그아웃에 실패했습니다 다시 시도해 주세요.', '', 'error');
    },
  });

  return logOutMutation;
};

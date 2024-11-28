import { postLogIn } from '@/api/auth';
import { axiosInstance } from '@/api/axiosInstance';
import { useStore } from '@/store/useStore';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useLogInMutation = () => {
  const navigate = useNavigate();
  const addToast = useStore((state) => state.addToast);

  const logIn = useStore((state) => state.logIn);

  const logInMutation = useMutation({
    mutationFn: postLogIn,
    onSuccess: ({ accessToken }) => {
      localStorage.setItem(`ACCESS_TOKEN_KEY`, accessToken);
      axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
      logIn();
      addToast('로그인 되었습니다.', '', 'success');
    },
    onError: () => {
      addToast('로그인에 실패했습니다 다시 시도해 주세요.', '', 'error');
    },
    onSettled: () => {
      navigate('/');
    },
  });

  return logInMutation;
};

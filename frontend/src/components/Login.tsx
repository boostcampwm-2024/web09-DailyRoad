import { useUserInfoQuery } from '@/hooks/api/useUserInfoQuery';
import { useStore } from '@/store/useStore';
import { useLayoutEffect } from 'react';

type LoginProps = {
  children: React.ReactNode;
};

const Login = ({ children }: LoginProps) => {
  const login = useStore((state) => state.logIn);
  const { data } = useUserInfoQuery();
  const setUser = useStore((state) => state.setUser);

  useLayoutEffect(() => {
    if (localStorage.getItem('ACCESS_TOKEN_KEY')) {
      login();
      if (data) {
        setUser(data);
      }
    }
  }, []);

  return <>{children}</>;
};

export default Login;

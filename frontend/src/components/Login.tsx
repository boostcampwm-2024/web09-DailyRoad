import { useLayoutEffect } from 'react';

import { useUserInfoQuery } from '@/hooks/api/useUserInfoQuery';
import { useStore } from '@/store/useStore';

type LoginProps = {
  children: React.ReactNode;
};

const Login = ({ children }: LoginProps) => {
  const login = useStore((state) => state.logIn);
  const { data, refetch } = useUserInfoQuery();
  const setUser = useStore((state) => state.setUser);

  useLayoutEffect(() => {
    if (localStorage.getItem('ACCESS_TOKEN_KEY')) {
      login();
      refetch();
    }
  }, []);
  useLayoutEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);
  return <>{children}</>;
};

export default Login;

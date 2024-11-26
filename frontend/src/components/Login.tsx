import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

type LoginProps = {
  children: React.ReactNode;
};

const Login = ({ children }: LoginProps) => {
  const login = useStore((state) => state.logIn);
  console.log(
    localStorage.getItem('ACCESS_TOKEN_KEY'),
    'localStorage.getItem("ACCESS_TOKEN")',
  );
  useEffect(() => {
    if (localStorage.getItem('ACCESS_TOKEN_KEY')) {
      login();
    }
  }, []);

  return <>{children}</>;
};

export default Login;

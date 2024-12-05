import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { useStore } from '@/store/useStore';

type AuthorizeProps = {
  children: React.ReactNode;
  id: number;
};

const Authorize = ({ children, id }: AuthorizeProps) => {
  const isLogged = useStore((state) => state.isLogged);
  const user = useStore((state) => state.user);
  const addToast = useStore((state) => state.addToast);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged) {
      addToast('올바르지 않은 접근입니다.', '', 'error');
      navigate(ROUTES.ROOT);
    } else if (user?.id !== id) {
      addToast('올바르지 않은 접근입니다.', '', 'error');
      console.log(user?.id, id);
      navigate(ROUTES.ROOT);
    }
  }, []);

  return <>{children}</>;
};

export default Authorize;

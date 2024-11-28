import { useLogOutMutation } from '@/hooks/api/useLogoutMutation';
import { useStore } from '@/store/useStore';

const LogOutButton = () => {
  const logoutMutation = useLogOutMutation();
  const logout = useStore((state) => state.logOut);
  const onClick = () => {
    logoutMutation.mutate();
    logout();
  };
  return <button onClick={onClick}>로그아웃</button>;
};

export default LogOutButton;

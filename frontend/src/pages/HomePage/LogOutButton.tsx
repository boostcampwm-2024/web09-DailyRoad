import { useLogOutMutation } from '@/hooks/api/useLogoutMutation';
import { useStore } from '@/store/useStore';

const LogOutButton = () => {
  const logoutMutation = useLogOutMutation();
  const logout = useStore((state) => state.logOut);
  const onClick = () => {
    logoutMutation.mutate();
    logout();
  };
  return (
    <button
      className="h-12 w-36 rounded-md bg-c_bg_blue p-2 px-4 text-white"
      onClick={onClick}
    >
      로그아웃
    </button>
  );
};

export default LogOutButton;

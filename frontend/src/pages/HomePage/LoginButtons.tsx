import { useEffect } from 'react';

import GoogleIcon from '@/components/common/GoogleIcon';
import UserProfile from './UserProfile';
import LogOutButton from './LogOutButton';

import { getRedirectUri } from '@/api/auth';
import { useUserInfoQuery } from '@/hooks/api/useUserInfoQuery';
import { useStore } from '@/store/useStore';

const LoginButtons = () => {
  const user = useStore((state) => state.user);
  const isLogged = useStore((state) => state.isLogged);
  const setUser = useStore((state) => state.setUser);
  const logOut = useStore((state) => state.logOut);
  const addToast = useStore((state) => state.addToast);
  const { data, refetch, error } = useUserInfoQuery();
  const token = localStorage.getItem('ACCESS_TOKEN_KEY');

  const handleLogin = async () => {
    try {
      const redirectUri: string | null = await getRedirectUri();
      if (redirectUri) {
        window.location.href = redirectUri;
      } else {
        console.error('Redirect URI is undefined or null');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  useEffect(() => {
    if (isLogged && data) {
      setUser(data);
    }
    if ((isLogged && !data && !token) || error) {
      addToast(
        '사용자 정보를 불러오지 못했습니다. 다시 로그인해주세요.',
        '',
        'error',
      );
      logOut();
    }
    if (!data && token) {
      refetch();
    }
  }, [isLogged, data]);

  return (
    <>
      {!isLogged ? (
        <div className="flex h-12 items-center justify-center gap-2 rounded-md border-[1px] border-c_button_gray p-2 px-4">
          <GoogleIcon width={24} height={24} />
          <button className="" onClick={handleLogin}>
            구글 로그인
          </button>
        </div>
      ) : (
        user && (
          <div className="flex justify-between gap-5">
            <UserProfile user={user} />
            <LogOutButton />
          </div>
        )
      )}
    </>
  );
};
export default LoginButtons;

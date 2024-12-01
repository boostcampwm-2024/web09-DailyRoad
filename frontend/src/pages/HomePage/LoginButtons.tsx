import { useStore } from '@/store/useStore';
import UserProfile from './UserProfile';
import { useUserInfoQuery } from '@/hooks/api/useUserInfoQuery';
import { useEffect } from 'react';
import { getRedirectUri } from '@/api/auth';
import LogOutButton from './LogOutButton';

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
        <div className="flex justify-between gap-5">
          <button onClick={handleLogin}>구글 로그인</button>
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

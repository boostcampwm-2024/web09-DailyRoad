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
  const logIn = useStore((state) => state.logIn);
  const addToast = useStore((state) => state.addToast);
  const data = useUserInfoQuery();

  useEffect(() => {
    console.log('data', data, isLogged);
    if (isLogged && data) {
      setUser(data);
    }
  }, [isLogged, data]);

  const handleLogin = async () => {
    try {
      const redirectUri = await getRedirectUri();
      if (redirectUri) {
        console.log('Redirect URI:', redirectUri);
        window.location.href = redirectUri;
      } else {
        console.error('Redirect URI is undefined or null');
        // 사용자에게 오류 메시지를 표시하거나 다른 처리를 할 수 있습니다.
      }
    } catch (error) {
      console.error('Error during login:', error);
      // 사용자에게 오류 메시지를 표시하거나 다른 처리를 할 수 있습니다.
    }
  };

  const handleAdminLogin = () => {
    localStorage.setItem(
      'ACCESS_TOKEN_KEY',
      import.meta.env.VITE_TEST_ACCESS_TOKEN,
    );
    addToast('테스트 계정으로 로그인 되었습니다.', '', 'success');
    logIn();
  };

  return (
    <div className="flex justify-between gap-1">
      {!isLogged ? (
        <>
          <button className="" onClick={handleLogin}>
            구글 로그인
          </button>
          <button
            onClick={handleAdminLogin}
            className="rounded-md border-2 border-gray-500 px-4 py-2"
          >
            테스트 id 로그인
          </button>
        </>
      ) : user ? (
        <>
          <UserProfile user={user} />
          <LogOutButton />
        </>
      ) : null}
    </div>
  );
};

export default LoginButtons;

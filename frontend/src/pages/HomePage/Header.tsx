import { getRedirectUri } from '@/api/auth';
import { useUserInfoQuery } from '@/hooks/api/useUserInfoQuery';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';
import UserProfile from './UserProfile';

const Header = () => {
  const user = useStore((state) => state.user);
  const isLogged = useStore((state) => state.isLogged);
  const setUser = useStore((state) => state.setUser);
  const data = useUserInfoQuery(localStorage.getItem('ACCESS_TOKEN_KEY'));
  const handleLogin = async () => {
    const redirectUri = await getRedirectUri();
    window.location.href = redirectUri;
  };
  const handleAdminLogin = () => {
    localStorage.setItem(
      'ACCESS_TOKEN_KEY',
      import.meta.env.VITE_TEST_ACCESS_TOKEN,
    );
    console.log(localStorage.getItem('ACCESS_TOKEN_KEY'));
  };

  useEffect(() => {
    if (isLogged && data) {
      setUser(data);
      console.log('user', data);
    }
  }, [isLogged, data]);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Logo</h1>
        <div className="flex justify-between gap-1">
          {!isLogged ? (
            <button className="" onClick={handleLogin}>
              구글 로그인
            </button>
          ) : user !== null ? (
            <UserProfile user={user} />
          ) : null}
          <button
            onClick={handleAdminLogin}
            className="rounded-md border-2 border-gray-500 px-4 py-2"
          >
            테스트 id 로그인
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

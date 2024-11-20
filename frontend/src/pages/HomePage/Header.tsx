import { useStore } from '@/store/useStore';

const Header = () => {
  const user = useStore((state) => state.user);
  const handleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
  };
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Logo</h1>
        <button className="" onClick={handleLogin}>
          {user ? user.nickname : '로그인'}
        </button>
      </div>
    </header>
  );
};

export default Header;

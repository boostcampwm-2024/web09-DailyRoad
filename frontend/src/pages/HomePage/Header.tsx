import { Suspense } from 'react';

import LoginButtons from './LoginButtons';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Logo</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginButtons />
        </Suspense>
      </div>
    </header>
  );
};

export default Header;

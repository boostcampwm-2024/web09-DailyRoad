import { Suspense } from 'react';

import logo from '/logo.svg';
import LoginButtons from './LoginButtons';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <img src={logo} alt="Logo" className="h-8 w-auto" />
        <Suspense fallback={<div>Loading...</div>}>
          <LoginButtons />
        </Suspense>
      </div>
    </header>
  );
};

export default Header;

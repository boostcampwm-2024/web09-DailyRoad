import { Suspense } from 'react';

import logo from '../../assets/logo.svg';
import LoginButtons from './LoginButtons';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8 w-auto cursor-pointer" />
        </Link>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginButtons />
        </Suspense>
      </div>
    </header>
  );
};

export default Header;

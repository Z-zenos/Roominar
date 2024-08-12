'use client';

import type { FC } from 'react';

import Navbar from './Navbar';

type HeaderProps = {
  activeItem?: number;
};

const Header: FC<HeaderProps> = () => {
  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Header;

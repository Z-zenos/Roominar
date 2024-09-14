'use client';

import type { FC } from 'react';

import Navbar from '../common/Navbar';

type HeaderProps = {
  className?: string;
  hasLogo?: boolean;
};

const Header: FC<HeaderProps> = ({ className, hasLogo }) => {
  return (
    <div>
      <Navbar
        className={className}
        hasLogo={hasLogo}
      />
    </div>
  );
};

export default Header;

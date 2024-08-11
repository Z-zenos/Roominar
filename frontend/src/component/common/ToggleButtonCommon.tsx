import type { ReactNode } from 'react';
import React from 'react';

const ToggleButtonCommon = ({
  className,
  active,
  startIcon,
  children,
  callback,
}: {
  className?: string;
  active?: boolean;
  startIcon?: ReactNode;
  children?: string | ReactNode;
  callback?: () => void;
}) => {
  return (
    <div
      onClick={callback}
      className={`${className} w-full h-12 flex justify-start items-center p-4 gap-1 rounded-[5px] text-base cursor-pointer duration-300 ${
        active ? 'bg-tertiary text-white' : 'bg-[#f5f5f5] text-black/85 hover:bg-[#eeeeee]'
      }`}
    >
      {startIcon}
      {children}
    </div>
  );
};

export default ToggleButtonCommon;

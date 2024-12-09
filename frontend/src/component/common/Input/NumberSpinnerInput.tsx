'use client';

import clsx from 'clsx';
import './Input.css';

interface NumberSpinnerInputProps {
  className?: string;
  onChange?: (value: number) => void;
  value?: number;
  max?: number;
}

export default function NumberSpinnerInput({
  className,
  onChange,
  value = 0,
  max,
}: NumberSpinnerInputProps) {
  return (
    <div className={clsx('custom-number-input h-7 w-28', className)}>
      <div className='flex flex-row h-7 w-full rounded-lg relative bg-transparent mt-1'>
        <button
          data-action='decrement'
          className=' bg-slate-200 text-gray-500 hover:text-gray-600 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none'
          onClick={(e) => {
            e.preventDefault();
            onChange?.(+value - 1 > 0 ? +value - 1 : 0);
          }}
        >
          <span className='m-auto text-2xl font-thin'>−</span>
        </button>
        <input
          type='number'
          className='outline-none focus:outline-none text-center w-full font-semibold text-md hover:text-black focus:text-black  md:text-base cursor-text flex items-center text-gray-600 '
          name='custom-input-number'
          onClick={(e) => e.currentTarget.focus()}
          onChange={(e) => {
            onChange?.(Number(e.target.value));
          }}
          value={value}
        />
        <button
          data-action='increment'
          className='bg-gray-200 text-gray-500 hover:text-gray-600 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer'
          onClick={(e) => {
            e.preventDefault();
            onChange?.(+value + 1 < max ? +value + 1 : max);
          }}
        >
          <span className='m-auto text-2xl font-thin'>+</span>
        </button>
      </div>
    </div>
  );
}

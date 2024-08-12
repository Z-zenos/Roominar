'use client';

import { MdEmojiEvents } from 'react-icons/md';

interface CategoryProps {
  title: string;
}

function Category({ title }: CategoryProps) {
  return (
    <div className='flex items-center flex-col gap-2 justify-center opacity-60 cursor-pointer transition-all hover:opacity-100 hover:text-primary min-w-[100px]'>
      <span className='rounded-full p-5 border border-gray-400 hover:border-primary'>
        <MdEmojiEvents size={30} />
      </span>
      {title}
    </div>
  );
}

export default Category;

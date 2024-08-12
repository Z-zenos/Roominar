'use client';

import './DotLoader.css';

function DotLoader() {
  return (
    <div className='py-[200px]'>
      <div className='dot-spinner col-span-3'>
        <div className='dot-spinner__dot' />
        <div className='dot-spinner__dot' />
        <div className='dot-spinner__dot' />
        <div className='dot-spinner__dot' />
        <div className='dot-spinner__dot' />
        <div className='dot-spinner__dot' />
        <div className='dot-spinner__dot' />
        <div className='dot-spinner__dot' />
      </div>
    </div>
  );
}

export default DotLoader;

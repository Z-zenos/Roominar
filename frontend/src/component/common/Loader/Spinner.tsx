'use client';

import './Spinner.css';

function Spinner() {
  return (
    <svg
      className='border-[3px] border-[rgba(0,_0,_0,_0.2)] border-t-white border-r-white inline-block animate-spin h-5 w-5 mr-3 rounded-[50%]'
      viewBox='0 0 24 24'
    />
  );
}

export default Spinner;

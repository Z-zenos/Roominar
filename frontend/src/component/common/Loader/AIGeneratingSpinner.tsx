'use client';

import './AIGeneratingSpinner.css';

function AIGeneratingSpinner() {
  return (
    <div className='spinnerContainer my-20'>
      <div className='spinner'></div>
      <div className='loader'>
        <p>Reading</p>
        <div className='words'>
          <span className='word'>title</span>
          <span className='word'>tags</span>
          <span className='word'>timeline</span>
          <span className='word'>prompt</span>
          <span className='word'>other</span>
        </div>
      </div>
    </div>
  );
}

export default AIGeneratingSpinner;

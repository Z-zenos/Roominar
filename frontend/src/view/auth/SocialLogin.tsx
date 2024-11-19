'use client';

import { signIn } from 'next-auth/react';
import { AiFillFacebook } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

function SocialLogin() {
  return (
    <div className='flex items-center justify-center mt-3'>
      <FcGoogle
        size={30}
        className='cursor-pointer mr-2'
        onClick={() => signIn('google', { callbackUrl: '/home' })}
      />
      <AiFillFacebook
        size={30}
        className='cursor-pointer ml-2 text-[#1877F2]'
      />
    </div>
  );
}

export default SocialLogin;

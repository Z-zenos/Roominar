import type { RegisterAudienceResponse } from '@/src/lib/api/generated';
import { formatEventDate } from '@/src/util/app.util';
import { Button } from '@nextui-org/button';

function SuccessRegistration({ email, expireAt }: RegisterAudienceResponse) {
  return (
    <div className='flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-lg'>
        <h2 className='text-pink-600 text-xl font-bold text-center mb-4'>Currently, You Are Temporarily Registered</h2>
        <p className='text-center mb-4'>
          A confirmation email has been sent to [<span className='font-semibold'>{email}</span>]. Please complete the
          registration using the URL provided in the email.
        </p>
        <div className='bg-gray-100 p-4 rounded-md mb-4'>
          <p className='text-sm text-red-500'>
            ※ The URL is valid until [<span className='font-semibold'>{formatEventDate(expireAt)}</span>]. If the
            expiration date has passed, please reapply.
          </p>
          <p className='text-sm text-gray-500'>
            ※ It may take some time for the email to arrive, so please wait patiently.
          </p>
        </div>
        <div className='text-center'>
          <Button color='primary' className='my-3 mx-auto w-[160px] font-semibold' radius='none'>
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SuccessRegistration;

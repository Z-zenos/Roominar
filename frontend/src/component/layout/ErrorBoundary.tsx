'use client';

import { Component } from 'react';
import Logo from '../common/Logo';
import { Image } from '@nextui-org/react';

class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
          <div className='text-center'>
            <Logo />
            <Image
              src='/icons/not-found.png'
              width={200}
              alt='not found image'
              classNames={{ wrapper: 'block mx-auto' }}
            />
            <h1 className='mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
              Page not found
            </h1>
            <p className='mt-6 text-base leading-7 text-gray-600'>
              Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <a
                href='/home'
                className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Go back home
              </a>
              <a
                href='#'
                className='text-sm font-semibold text-gray-900'
              >
                Contact support <span aria-hidden='true'>&rarr;</span>
              </a>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

'use client';

import { formatEventDate } from '@/src/util/app.util';

interface TimelineProps {
  applicationStartAt?: Date;
  applicationEndAt?: Date;
  startAt?: Date;
  endAt?: Date;
}

function Timeline({ applicationStartAt, applicationEndAt, startAt, endAt }: TimelineProps) {
  return (
    <div className='w-full max-w-6xl mx-auto bg-emerald-50'>
      <div className='flex flex-col justify-center divide-y divide-slate-200 [&>*]:py-16'>
        <div className='w-full max-w-3xl px-16'>
          <div className='-my-6'>
            <div className='relative pl-8 sm:pl-32 py-2 group'>
              <div className='font-caveat font-medium text-2xl text-indigo-500 mb-1 sm:mb-0 ml-[6rem]'>
                Application Start At
              </div>

              <div className='flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[13rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[13rem] after:-translate-x-1/2 after:translate-y-1.5'>
                <time className='sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-48 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full'>
                  {formatEventDate(applicationStartAt)}
                </time>
                <div className='text-nm ml-[6rem] font-light text-slate-900'>Acme was founded in Milan, Italy</div>
              </div>
            </div>

            <div className='relative pl-8 sm:pl-32 py-2 group'>
              <div className='font-caveat font-medium text-2xl text-indigo-500 mb-1 sm:mb-0 ml-[6rem]'>
                Application End At
              </div>

              <div className='flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[13rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[13rem] after:-translate-x-1/2 after:translate-y-1.5'>
                <time className='sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-48 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full'>
                  {formatEventDate(applicationEndAt)}
                </time>
                <div className='text-nm ml-[6rem] font-light text-slate-900'>Acme was founded in Milan, Italy</div>
              </div>
            </div>

            <div className='relative pl-8 sm:pl-32 py-2 group'>
              <div className='font-caveat font-medium text-2xl text-indigo-500 mb-1 sm:mb-0 ml-[6rem]'>Start At</div>

              <div className='flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[13rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[13rem] after:-translate-x-1/2 after:translate-y-1.5'>
                <time className='sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-48 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full'>
                  {formatEventDate(startAt)}
                </time>
                <div className='text-nm ml-[6rem] font-light text-slate-900'>Acme was founded in Milan, Italy</div>
              </div>
            </div>

            <div className='relative pl-8 sm:pl-32 py-2 group'>
              <div className='font-caveat font-medium text-2xl text-indigo-500 mb-1 sm:mb-0 ml-[6rem]'>End At</div>

              <div className='flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[13rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-indigo-600 after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[13rem] after:-translate-x-1/2 after:translate-y-1.5'>
                <time className='sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold uppercase w-48 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full'>
                  {formatEventDate(endAt)}
                </time>
                <div className='text-nm ml-[6rem] font-light text-slate-900'>Acme was founded in Milan, Italy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timeline;

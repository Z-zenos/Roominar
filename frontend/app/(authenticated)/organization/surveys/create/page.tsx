'use client';

import CreateSurveyForm from '@/src/component/form/CreateSurveyForm';

export default function Page() {
  return (
    <div>
      <h3 className='text-xm text-primary mb-8'>
        Create Nicely Survey about Event
      </h3>
      <CreateSurveyForm />
    </div>
  );
}

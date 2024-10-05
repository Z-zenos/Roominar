import RegisterOrganizationForm from '@/src/component/form/RegisterOrganizationForm';

export default function Page() {
  return (
    <div className='mx-auto w-[600px] py-[5%]'>
      <h2 className='text-primary text-lg font-semibold flex justify-start items-center gap-3'>
        Create your own organization 🏢
      </h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        Host events and share information over the world.
      </p>
      <RegisterOrganizationForm />
    </div>
  );
}

import RegisterOrganizationForm from '@/src/component/form/RegisterOrganizationForm';

export default function Page() {
  return (
    <div className='mx-auto w-[600px] py-[5%]'>
      <h2 className='text-primary text-lg font-semibold flex justify-start items-center gap-3'>
        Tạo tổ chức của riêng bạn 🏢
      </h2>
      <p className='mt-2 mb-8 font-light text-gray-700 text-nm'>
        Tổ chức sự kiện và chia sẻ thông tin đến mọi người.
      </p>
      <RegisterOrganizationForm />
    </div>
  );
}

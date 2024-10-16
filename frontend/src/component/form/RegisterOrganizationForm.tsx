'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiMail } from 'react-icons/hi';
import clsx from 'clsx';
import { Form, FormCustomLabel, FormInput, FormInstructions } from './Form';
import { Link } from '@nextui-org/link';
import Button from '../common/Button/Button';
import {
  OrganizationTypeCode,
  type ApiException,
  type ErrorResponse400,
} from '@/src/lib/api/generated';
import type { RegisterOrganizationFormSchema } from '@/src/schemas/auth/RegisterOrganizationFormSchema';
import { registerOrganizationFormSchema } from '@/src/schemas/auth/RegisterOrganizationFormSchema';
import { useRegisterOrganizationMutation } from '@/src/api/organization.api';
import { BaseTabs, TabsList, TabsTrigger } from '../common/Tabs';
import { useTranslations } from 'next-intl';
import { MdPhone } from 'react-icons/md';

function RegisterOrganizationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const t = useTranslations('code');
  const [isBusiness, setIsBusiness] = useState<boolean>(false);

  const form = useForm<RegisterOrganizationFormSchema>({
    mode: 'all',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      organizationName: '',
      cityCode: '',
      address: '',
      representativeUrl: '',
      phone: '',
      organizationType: OrganizationTypeCode.Personal,
    },
    resolver: zodResolver(registerOrganizationFormSchema),
  });

  const {
    trigger,
    data,
    isMutating: isLoading,
  } = useRegisterOrganizationMutation({
    onSuccess() {
      toast.success('Successfully Account Registration!');
    },
    onError(error: ApiException<unknown>) {
      toast.error(
        (error.body as ErrorResponse400)?.message ??
          (error.body as ErrorResponse400)?.errorCode ??
          'Unknown Error 😵',
      );
    },
  });

  const handleRegister = (value: RegisterOrganizationFormSchema) => {
    trigger({
      registerOrganizationRequest: {
        email: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
        password: value.password,
        confirmPassword: value.confirmPassword,
        name: value.organizationName,
        cityCode: '',
        hpUrl: '',
        address: value.address,
        representativeUrl: value.representativeUrl,
        phone: value.phone,
        type: value.organizationType,
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className={clsx('grid grid-cols-2 items-center gap-5')}
      >
        <div className='col-span-2'>
          <FormCustomLabel
            htmlFor='email'
            required
          />
          <FormInput
            id='email'
            name='email'
            type='email'
            rightIcon={
              <HiMail
                size={20}
                className='text-primary'
              />
            }
            placeholder='registermail@gmail.com'
            control={form.control}
            isDisplayError={true}
            className={clsx(
              form.formState.errors.email &&
                form.formState.touchedFields.email &&
                'border-error-main',
            )}
          />

          <FormInstructions>
            <li>
              This email also used for contact between client and your
              organization.
            </li>
          </FormInstructions>
        </div>

        <div className='col-span-2'>
          <FormCustomLabel
            htmlFor='organizationName'
            required
          />
          <FormInput
            id='organizationName'
            name='organizationName'
            placeholder='ABC Company Inc.'
            className={clsx(
              form.formState.errors.organizationName &&
                form.formState.touchedFields.organizationName &&
                'border-error-main',
            )}
            control={form.control}
            isDisplayError={true}
          />
        </div>

        <div className='col-span-2'>
          <FormCustomLabel
            htmlFor='organizationType'
            required
          />

          <BaseTabs
            defaultValue={form.getValues('organizationType')}
            className={clsx('w-full mx-auto')}
          >
            <TabsList className={clsx('grid grid-cols-2')}>
              <TabsTrigger
                value={OrganizationTypeCode.Personal}
                onClick={() => {
                  form.setValue(
                    'organizationType',
                    OrganizationTypeCode.Personal,
                  );
                  setIsBusiness(false);
                }}
                className={clsx(
                  form.getValues('organizationType') ===
                    OrganizationTypeCode.Personal &&
                    '!bg-primary font-bold !text-white',
                )}
              >
                {t(OrganizationTypeCode.Personal)}
              </TabsTrigger>
              <TabsTrigger
                value={OrganizationTypeCode.Business}
                onClick={() => {
                  form.setValue(
                    'organizationType',
                    OrganizationTypeCode.Business,
                  );
                  setIsBusiness(true);
                }}
                className={clsx(
                  form.getValues('organizationType') ===
                    OrganizationTypeCode.Business &&
                    '!bg-primary font-bold !text-white',
                )}
              >
                {t(OrganizationTypeCode.Business)}
              </TabsTrigger>
            </TabsList>
          </BaseTabs>

          <FormInstructions>
            <li>
              If the organization type is {t(OrganizationTypeCode.Business)}, it
              will not be possible to change it to
              {t(OrganizationTypeCode.Personal)}.
            </li>
            <li>
              On the contrary, you can change it to
              {t(OrganizationTypeCode.Business)} in the future if needed. But
              you will need to provide some more information about your
              business.
            </li>
          </FormInstructions>
        </div>

        {isBusiness && (
          <div className='col-span-2 gap-3 grid grid-cols-7'>
            <div className='col-span-4 self-start'>
              <FormCustomLabel
                htmlFor='address'
                required={isBusiness}
              />
              <FormInput
                id='address'
                name='address'
                placeholder='12, abc street - xyz state, Vietnam'
                className={clsx(
                  form.formState.errors.address &&
                    form.formState.touchedFields.address &&
                    'border-error-main',
                )}
                control={form.control}
                isDisplayError={true}
              />
            </div>
            <div className='col-span-3 self-start'>
              <FormCustomLabel
                htmlFor='phone'
                required={isBusiness}
              />
              <FormInput
                id='phone'
                name='phone'
                type='tel'
                placeholder='0123456789'
                rightIcon={
                  <MdPhone
                    size={20}
                    className='text-primary'
                  />
                }
                className={clsx(
                  form.formState.errors.phone &&
                    form.formState.touchedFields.phone &&
                    'border-error-main',
                )}
                control={form.control}
                isDisplayError={true}
              />
            </div>
          </div>
        )}

        <div className='col-span-2'>
          <FormCustomLabel htmlFor='representativeUrl' />
          <div className='grid grid-cols-5 items-center'>
            <p className='col-span-2 text-sm underline text-primary'>
              https://roominar.com/organizations/
            </p>
            <div className='col-span-3'>
              <FormInput
                id='representativeUrl'
                name='representativeUrl'
                placeholder='abc'
                className={clsx(
                  form.formState.errors.representativeUrl &&
                    form.formState.touchedFields.representativeUrl &&
                    'border-error-main',
                )}
                control={form.control}
              />
            </div>
          </div>
          <FormInstructions>
            <li>The organization page URL cannot be changed later.</li>
            <li>
              The system will automatically generate the url for you if you do
              not set it yourself.
            </li>
            <li>The URL can contain alphanumeric characters.</li>
          </FormInstructions>
        </div>

        <div className='col-span-1'>
          <FormCustomLabel
            htmlFor='firstName'
            required
          />
          <FormInput
            id='firstName'
            name='firstName'
            placeholder='Kevin'
            className={clsx(
              form.formState.errors.firstName &&
                form.formState.touchedFields.firstName &&
                'border-error-main',
            )}
            control={form.control}
            isDisplayError={true}
          />
        </div>

        <div className='col-span-1 self-start'>
          <FormCustomLabel
            htmlFor='lastName'
            required
          />
          <FormInput
            id='lastName'
            name='lastName'
            placeholder='De Bruyne'
            className={clsx(
              form.formState.errors.lastName &&
                form.formState.touchedFields.lastName &&
                'border-error-main',
            )}
            control={form.control}
            isDisplayError={true}
          />
        </div>

        <div className='col-span-2 grid grid-cols-2 gap-3'>
          <div className='self-start'>
            <FormCustomLabel
              htmlFor='password'
              required
            />
            <FormInput
              id='password'
              name='password'
              type={!showPassword ? 'password' : 'text'}
              rightIcon={
                !showPassword ? (
                  <AiOutlineEyeInvisible
                    className='text-primary'
                    size={20}
                    onClick={() => setShowPassword(true)}
                  />
                ) : (
                  <AiOutlineEye
                    className='text-primary'
                    size={20}
                    onClick={() => setShowPassword(false)}
                  />
                )
              }
              placeholder='password!@%'
              className={clsx(
                form.formState.errors.password &&
                  form.formState.touchedFields.password &&
                  'border-error-main',
              )}
              control={form.control}
              isDisplayError={true}
            />
          </div>
          <div className='self-start'>
            <FormCustomLabel
              htmlFor='confirmPassword'
              required
            />
            <FormInput
              id='confirmPassword'
              name='confirmPassword'
              type={!showConfirmPassword ? 'password' : 'text'}
              rightIcon={
                !showConfirmPassword ? (
                  <AiOutlineEyeInvisible
                    className='text-primary'
                    size={20}
                    onClick={() => setShowConfirmPassword(true)}
                  />
                ) : (
                  <AiOutlineEye
                    className='text-primary'
                    size={20}
                    onClick={() => setShowConfirmPassword(false)}
                  />
                )
              }
              placeholder='password!@%'
              className={clsx(
                form.formState.errors.confirmPassword &&
                  form.formState.touchedFields.confirmPassword &&
                  'border-error-main',
              )}
              control={form.control}
              isDisplayError={true}
            />
          </div>
        </div>

        <div className='col-span-2'>
          <Button
            title='Register'
            type='submit'
            className='w-2/3 mt-5 mx-auto'
            disabled={!form.formState.isValid}
            isLoading={isLoading}
          />
          <br />

          <h5 className='text-center pt-4 font-Poppins text-nm font-light'>
            Already have account?
            <Link
              href='/organization/login'
              className='text-primary font-semibold pl-1 cursor-pointer'
            >
              Login
            </Link>
          </h5>
        </div>
      </form>
    </Form>
  );
}

export default RegisterOrganizationForm;

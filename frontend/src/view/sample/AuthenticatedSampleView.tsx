'use client';

import AuthenticatedInfo from '@/app/(authenticated)/authenticated_sample/AuthenticatedInfo';
import { useEffect } from 'react';

export interface IAuthenticatedSampleViewProps {}

export default function AuthenticatedSampleView(props: IAuthenticatedSampleViewProps) {
  useEffect(() => {
    console.log(1);
  }, []);
  return <AuthenticatedInfo />;
}

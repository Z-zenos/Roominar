import type { Metadata } from 'next';
import AuthenticatedSampleView from '@/src/view/sample/AuthenticatedSampleView';

export default function Page() {
  return <AuthenticatedSampleView />;
}

export const metadata: Metadata = {
  title: 'ZOLL',
  description: 'ZOLL | Authenticated Sample',
};

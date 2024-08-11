import PersonalInfoView from '@/src/view/personal/PersonalInfoView';
import type { Metadata } from 'next';

export default function Page() {
  return <PersonalInfoView />;
}

export const metadata: Metadata = {
  title: 'Patient Info',
  description: 'ZOLL | Patient Info',
};

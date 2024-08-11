import VitalView from '@/src/view/vital/VitalView';
import type { Metadata } from 'next';

export default function Page() {
  return <VitalView />;
}

export const metadata: Metadata = {
  title: 'Vital Info',
  description: 'ZOLL | Vital Info',
};

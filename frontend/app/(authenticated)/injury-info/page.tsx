import InjuryInfoView from '@/src/view/injury/InjuryInfoView';
import type { Metadata } from 'next';

export default function Page() {
  return <InjuryInfoView />;
}

export const metadata: Metadata = {
  title: 'Injury Info',
  description: 'ZOLL | Injury Info',
};

import type { Metadata } from 'next';

export default function Page() {
  return <span>Authenticated</span>;
}

export const metadata: Metadata = {
  title: 'Roominar',
  description: 'Roominar | Authenticated Sample',
};

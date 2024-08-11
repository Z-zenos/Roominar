import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ZOLL',
  description: 'ZOLL',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className='h-[100vh] flex flex-col'>{children}</div>;
}

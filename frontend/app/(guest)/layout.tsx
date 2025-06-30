'use client';

import Footer from '@/src/component/layout/Footer';
import Navbar from '@/src/component/common/Navbar/Navbar';
import { useIsStandalone } from '@/src/hooks/useIsStandalone';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isStandalone = useIsStandalone();

  return (
    <>
      <Navbar />
      {children}
      {!isStandalone && <Footer />}
    </>
  );
}

'use client';

import Footer from '@/src/component/layout/Footer';
import Navbar from '@/src/component/common/Navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

import LoadingGlobal from '@/src/component/layout/LoadingGlobal';
import RootProvider from '@/src/component/layout/RootProvider';
import authOptions from '@/src/utils/authOptions';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '@/src/styles/globals.css';
import clsx from 'clsx';
import { fontSans } from '@/src/constants/fonts.constant';
import { UIProvider } from '@/src/contexts/UIProvider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Roominar',
  description: 'Webinar & Event System',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: {
    locale: string;
  };
}>) {
  const messages = await getMessages();
  const session = await getServerSession(authOptions);
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <head />
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <RootProvider session={session}>
            <UIProvider
              themeProps={{ attribute: 'class', defaultTheme: 'white' }}
            >
              <LoadingGlobal />
              <div>{children}</div>
              <Toaster
                position='top-right'
                reverseOrder={false}
              />
            </UIProvider>
          </RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

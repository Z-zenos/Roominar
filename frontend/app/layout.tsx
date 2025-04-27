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
      <head>
        <meta
          name='application-name'
          content='Roominar'
        />
        <meta
          name='apple-mobile-web-app-capable'
          content='yes'
        />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='default'
        />
        <meta
          name='apple-mobile-web-app-title'
          content='Roominar'
        />
        <meta
          name='description'
          content='Find and book virtual and physical event spaces'
        />
        <meta
          name='format-detection'
          content='telephone=no'
        />
        <meta
          name='mobile-web-app-capable'
          content='yes'
        />
        <meta
          name='msapplication-TileColor'
          content='#2B5797'
        />
        <meta
          name='msapplication-tap-highlight'
          content='no'
        />
        <meta
          name='theme-color'
          content='#000000'
        />

        <link
          rel='apple-touch-icon'
          href='/icons/apple-icon-180.png'
        />
        <link
          rel='manifest'
          href='/manifest.json'
        />
        <link
          rel='shortcut icon'
          href='/favicon.ico'
        />
      </head>
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

import LoadingGlobal from '@/src/component/layout/LoadingGlobal';
import RootProvider from '@/src/component/layout/RootProvider';
import theme from '@/src/theme/configTheme';
import authOptions from '@/src/util/authOptions';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Noto_Sans_JP } from 'next/font/google';
import '../src/style/globals.css';

const inter = Noto_Sans_JP({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZOLL',
  description: 'ZOLL',
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
    <html lang='en' className='bg-[#fff]'>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider theme={theme}>
              <RootProvider session={session}>
                <LoadingGlobal />
                {children}
              </RootProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

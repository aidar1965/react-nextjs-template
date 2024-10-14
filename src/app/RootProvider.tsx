// RootProvider.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import RootLayout from './RootLayout';

export default async function RootProvider({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages({locale});

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <RootLayout>{children}</RootLayout>
    </NextIntlClientProvider>
  );
}
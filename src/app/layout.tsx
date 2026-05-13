import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';
import { isRtlLocale, type Locale } from '@/i18n/config';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta');
  const locale = await getLocale();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
      default: t('homeTitle'),
      template: '%s | QR Generator',
    },
    description: t('homeDescription'),
    keywords: [
      'QR code generator',
      'QR code maker',
      'free QR code',
      'WiFi QR code',
      'vCard QR code',
      'URL QR code',
      'menu QR code',
      'event QR code',
      'business card QR',
      'bulk QR generator',
    ],
    authors: [{ name: 'QR Generator' }],
    creator: 'QR Generator',
    manifest: '/manifest.json',
    icons: {
      icon: '/favicon.ico',
      apple: '/icons/icon-192x192.png',
    },
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      type: 'website',
      locale,
      alternateLocale: locale === 'ar' ? 'en' : 'ar',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('homeTitle'),
      description: t('homeDescription'),
    },
    alternates: {
      canonical: '/',
      languages: {
        en: '/?locale=en',
        ar: '/?locale=ar',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const isRtl = isRtlLocale(locale);

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1 container py-6 md:py-8">{children}</main>
            <Footer />
            <Toaster position={isRtl ? 'bottom-left' : 'bottom-right'} />
            <ServiceWorkerRegistration />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

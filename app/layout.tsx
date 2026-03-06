import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import { TopBar } from '@/app/components/TopBar';

export const metadata: Metadata = {
  title: 'Intambwe Media | Amakuru Agezweho | Igihe Cyose | Breaking News',
  description:
    'Independent, credible journalism for East Africa. Breaking news, investigations, and analysis in Kinyarwanda, English, and Swahili on Rwanda, politics, business, technology, and more.',
  keywords: ['News', 'East Africa', 'Rwanda', 'Journalism', 'Amakuru', 'Intambwe', 'Breaking News', 'Politics', 'Business', 'Technology'],
  authors: [{ name: 'Intambwe Media' }],
  creator: 'Intambwe Media',
  publisher: 'Intambwe Media',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ky_RW',
    alternateLocale: ['en_US', 'sw_TZ'],
    url: 'https://amakuru.news',
    siteName: 'Intambwe Media',
    title: 'Intambwe Media | Breaking News and Journalism',
    description: 'Independent journalism covering Rwanda and East Africa in Kinyarwanda, English, and Swahili',
    images: [{
      url: 'https://amakuru.news/logo.png',
      width: 1200,
      height: 630,
      alt: 'Intambwe Media Logo',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@intambwemedias',
    creator: '@intambwemedias',
    title: 'Intambwe Media | Breaking News',
    description: 'Independent journalism from East Africa',
    images: ['https://amakuru.news/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    languages: {
      ky: 'https://amakuru.news/ky',
      en: 'https://amakuru.news/en',
      sw: 'https://amakuru.news/sw',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ky" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#e2001a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="canonical" href="https://amakuru.news" />
        <link rel="icon" href="/logo.png" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: 'Intambwe Media',
              url: 'https://amakuru.news',
              logo: 'https://amakuru.news/logo.png',
              description: 'Independent journalism for East Africa',
              sameAs: [
                'https://twitter.com/intambwemedias',
                'https://facebook.com/intambwemedia',
                'https://youtube.com/@intambwemedia',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Editorial',
              },
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <TopBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}


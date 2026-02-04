import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://top10psychicreaders.com'),
  title: {
    default: 'Top 10 Best Psychic Reading Sites 2026 | Top10PsychicReaders',
    template: '%s | Top10PsychicReaders',
  },
  description:
    'Discover the best online psychic reading platforms. Compare top-rated psychics, read honest reviews, and find the perfect advisor for love, career, and spiritual guidance.',
  keywords: [
    'psychic reading',
    'online psychic',
    'tarot reading',
    'love psychic',
    'best psychic sites',
    'psychic reviews',
  ],
  authors: [{ name: 'Top10PsychicReaders' }],
  creator: 'Top10PsychicReaders',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://top10psychicreaders.com',
    siteName: 'Top10PsychicReaders',
    title: 'Top 10 Best Psychic Reading Sites 2026',
    description:
      'Discover the best online psychic reading platforms. Compare top-rated psychics and find your perfect advisor.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Top10PsychicReaders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top 10 Best Psychic Reading Sites 2026',
    description:
      'Discover the best online psychic reading platforms. Compare top-rated psychics and find your perfect advisor.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

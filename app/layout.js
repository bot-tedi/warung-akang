import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

export const metadata = {
  title: 'Warung Akang - Premium Picked Produce & Signature Asinan',
  description: 'Nikmati hidangan homemade berkualitas dengan bahan segar pilihan. Sayur organik, buah segar, dan asinan khas resep warisan keluarga.',
  keywords: 'warung sayur, sayur organik, asinan sayur, sayur segar, buah segar, bumbu dapur, asinan jakarta',
  openGraph: {
    title: 'Warung Akang - Premium Picked Produce & Signature Asinan',
    description: 'Nikmati hidangan homemade berkualitas dengan bahan segar pilihan langsung dari petani.',
    url: 'https://warung-akang.vercel.app',
    siteName: 'Warung Akang',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Warung Akang Premium Produce',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warung Akang - Premium Picked Produce',
    description: 'Bahan segar pilihan langsung dari petani ke dapur Anda.',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Warung Sayur - Bahan Makanan Segar Harian | Warung Akang',
  description: 'Belanja sayur organik, buah segar, bumbu dapur, dan sembako berkualitas premium langsung dari petani lokal. Pengiriman cepat untuk kebutuhan harian Anda.',
  keywords: 'warung sayur, jual sayur online, sayur organik, buah segar, bumbu dapur, sembako murah, sayur berkualitas',
  openGraph: {
    title: 'Warung Sayur - Bahan Makanan Segar Harian | Warung Akang',
    description: 'Bahan makanan berkualitas premium langsung dari petani ke dapur Anda. 100% Segar setiap hari.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Koleksi Sayur Segar Warung Akang',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warung Sayur - Warung Akang',
    description: 'Belanja sayur organik pilihan untuk kebutuhan keluarga modern.',
    images: ['https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&q=80&w=1200'],
  },
};

export default function WarungSayurLayout({ children }) {
  return children;
}

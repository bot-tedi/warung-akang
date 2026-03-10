import './globals.css';

export const metadata = {
  title: 'Warung Akang - Hidangan Segar & Lezat',
  description: 'Nikmati hidangan homemade berkualitas dengan bahan segar pilihan. Pesan sekarang, kami antar ke rumah Anda!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}

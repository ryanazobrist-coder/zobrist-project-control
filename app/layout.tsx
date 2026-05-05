import './globals.css';

export const metadata = { title: 'Zobrist Project Control', description: 'Contract Control Center' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

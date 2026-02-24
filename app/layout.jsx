import './globals.css';
import { Outfit, Space_Grotesk } from 'next/font/google';
import ThemeToggle from '../components/ThemeToggle';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-body' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['300', '400', '500', '600', '700'], 
});

export const metadata = {
  title: 'BlueLine Ops',
  description: 'Facility Operations Center',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} ${outfit.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
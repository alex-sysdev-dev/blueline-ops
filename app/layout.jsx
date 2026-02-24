// app/layout.jsx
import './globals.css';
import { Outfit } from 'next/font/google';
import ThemeToggle from '../components/ThemeToggle';

// Load the modern Outfit font
const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  title: 'Blueline Ops',
  description: 'Facility Operations Center',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
        {children}
        
        {/* Our floating dark mode button */}
        <ThemeToggle />
      </body>
    </html>
  );
}
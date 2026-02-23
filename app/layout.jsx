// app/layout.jsx
import { Outfit } from 'next/font/google';
import './globals.css';

// Load the modern Outfit font
const outfit = Outfit({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
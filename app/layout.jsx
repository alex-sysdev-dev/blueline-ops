import './globals.css';
import { Sora, Manrope } from 'next/font/google';
import LayoutShell from '../components/layout/layoutshell';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'BlueLine Ops',
  description: 'Operations Intelligence Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${sora.variable} ${manrope.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}

import './globals.css';
import { Outfit, Space_Grotesk } from 'next/font/google';
import ThemeToggle from '../components/ThemeToggle';
import Sidebar from '../components/layout/Sidebar';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
});

const spaceGrotesk = Space_Grotesk({
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
        className={`${outfit.variable} ${spaceGrotesk.variable} ${outfit.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}
      >
        <div className="flex min-h-screen">
          
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 flex flex-col">

  {/* Top Bar */}
  <div className="flex items-center justify-end px-8 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
    <a
      href="/control-center"
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
      Network Status
    </a>
  </div>

  {/* Page Content */}
  <div className="p-8">
    {children}
  </div>

</main>
      

        </div>

        <ThemeToggle />
      </body>
    </html>
  );
}
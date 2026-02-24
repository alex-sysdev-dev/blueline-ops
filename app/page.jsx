// app/page.jsx
import Link from 'next/link';
import { ShieldCheck, Github, Chrome, BarChart3, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-300">
      
      {/* Dynamic Background Blurs (Transparent Overlays!) */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl pointer-events-none transition-colors duration-300"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-emerald-400/20 dark:bg-emerald-600/20 rounded-full blur-3xl pointer-events-none transition-colors duration-300"></div>

      <div className="z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Brand & Value Proposition */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <ShieldCheck className="w-12 h-12 text-blue-600 dark:text-blue-500 transition-colors" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
              <span className="text-blue-600 dark:text-blue-500">BLUE</span>LINE
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 transition-colors leading-tight">
            Leverage Data. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">
              Run Efficient Operations.
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 transition-colors">
            Transform your facility's performance with real-time analytics. Boost earnings, optimize headcount, and hit your target metrics without the guesswork.
          </p>

          {/* Frosted Glass Feature Badges */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            <div className="flex items-center justify-center gap-3 p-3 px-5 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <BarChart3 className="text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Data Analytics</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-3 px-5 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
              <Zap className="text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Boost Earnings</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth/Login Card (Glassmorphism effect) */}
        <div className="w-full max-w-md mx-auto relative">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/40 dark:border-slate-700/50 transition-colors duration-300">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center transition-colors">Secure Portal</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-8 transition-colors">Log in to access your Operations Center</p>
            
            <div className="space-y-4">
              {/* Google Button */}
              <Link href="/dashboard" className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-950 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <Chrome size={20} className="text-blue-500" />
                Continue with Google
              </Link>
              
              {/* GitHub Button */}
              <Link href="/dashboard" className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-[#24292e] hover:bg-[#1b1f23] text-white rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <Github size={20} />
                Continue with GitHub
              </Link>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-300 dark:border-slate-600 transition-colors"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-sm font-medium transition-colors">or</span>
                <div className="flex-grow border-t border-slate-300 dark:border-slate-600 transition-colors"></div>
              </div>

              {/* Guest / Direct Entry */}
              <Link href="/dashboard" className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-blue-600/30 hover:-translate-y-0.5">
                Log In with Email
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
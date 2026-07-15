import { Link, useLocation } from "react-router-dom";
import { Sparkles, Terminal } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6 md:px-8">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all duration-300">
            <Sparkles size={20} className="text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              SHIVIL <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-sm font-semibold px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">AI</span>
            </h1>
            <p className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold">
              The Intelligent Univ OS
            </p>
          </div>
        </Link>

        {/* Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
          <a href="#ai-demo" className="hover:text-white transition-colors duration-200">AI Console</a>
          <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
          <Link to="/design" className="hover:text-white transition-colors duration-200">Design System</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-all duration-200"
          >
            Sign In
          </Link>
          
          <Link
            to="/login"
            className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-medium text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Launch OS
              <Terminal size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
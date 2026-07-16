import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please input a valid university email address.");
      return;
    }

    if (!password) {
      setError("Please input your password.");
      return;
    }

    if (password.length < 6) {
      setError("Security check failed: Password must be at least 6 characters.");
      return;
    }

    setError("");
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Unauthorized access. Invalid credentials or network offline.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main glass card container */}
      <div className="relative w-full max-w-[440px] rounded-[2rem] border border-white/5 bg-slate-950/65 backdrop-blur-2xl p-8 md:p-10 shadow-2xl overflow-hidden">
        
        {/* Glow corner line decoration */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 mx-auto group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles size={16} />
            </div>
            <span className="text-md font-bold text-white tracking-tight">SHIVIL AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to your university operating system terminal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Email Address</label>
            <div className="relative group">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="email" 
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-900 bg-slate-950/50 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Security Password</label>
              <a href="#" className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors">Forgot key?</a>
            </div>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                disabled={loading}
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-900 bg-slate-950/50 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Form checkbox options */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={loading}
                className="w-4 h-4 rounded-md border-slate-800 bg-slate-950 accent-blue-500 text-blue-500 cursor-pointer"
              />
              <span className="text-xs text-slate-400">Remember credentials</span>
            </label>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-sm font-semibold text-white shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Decrypting credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In Terminal</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

        </form>

        {/* Footer info inside card */}
        <div className="mt-8 text-center border-t border-slate-900/60 pt-6">
          <p className="text-xs text-slate-600">
            Authorized academic personnel only. All access logs are strictly audited.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Login;
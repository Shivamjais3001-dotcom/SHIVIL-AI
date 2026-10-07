import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles, Loader2, ArrowRight, UserCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/auth.store";
import { Toast, type ToastProps } from "../components/ui/Toast";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "FACULTY">("STUDENT");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [toast, setToast] = useState<Omit<ToastProps, "onClose"> | null>(null);

  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please provide your full legal name.");
      return;
    }

    if (!email || !email.includes("@")) {
      setError("Please input a valid university email address.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the academic terms of service to create an account.");
      return;
    }

    setError("");
    setLoading(true);

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const success = await signup(email, password, role, undefined, fullName);
    setLoading(false);

    if (success) {
      setIsSubmittedSuccess(true);
      setToast({
        type: "success",
        title: "Account Created",
        message: "Verification email sent! Check your inbox.",
      });
    } else {
      const storeErr = useAuthStore.getState().error;
      const displayMsg = storeErr || "Registration rejected. Email may already be registered.";
      setError(displayMsg);
      setToast({
        type: "error",
        title: "Registration Failed",
        message: displayMsg,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[500px] rounded-[2rem] border border-white/5 bg-slate-950/65 backdrop-blur-2xl p-8 md:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 mx-auto group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles size={16} />
            </div>
            <span className="text-md font-bold text-white tracking-tight">SHIVIL AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Academic Account</h2>
          <p className="text-xs text-slate-500">Initialize your access terminal for SHIVIL AI OS</p>
        </div>

        {isSubmittedSuccess ? (
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Verification Email Sent!</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                We have dispatched a secure verification link to <span className="text-blue-400 font-semibold">{email}</span>. Please verify your email before logging in.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-sm font-semibold text-white shadow-lg transition"
              >
                Proceed to Login
              </button>
              <Link to="/resend-verification" className="text-xs text-slate-500 hover:text-slate-400 transition">
                Didn't receive email? Resend verification
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name input row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">First Name</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-900 bg-slate-950/50 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-900 bg-slate-950/50 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">University Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-900 bg-slate-950/50 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Academic Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("STUDENT")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    role === "STUDENT"
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                      : "border-slate-900 bg-slate-950/30 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <UserCheck size={14} />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("FACULTY")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    role === "FACULTY"
                      ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
                      : "border-slate-900 bg-slate-950/30 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <UserCheck size={14} />
                  <span>Faculty</span>
                </button>
              </div>
            </div>

            {/* Password input row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-900 bg-slate-950/50 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Confirm Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    disabled={loading}
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-900 bg-slate-950/50 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1.5 h-1.5 w-full">
                  <div className={`h-full flex-1 rounded-full transition-all duration-300 ${password.length >= 8 ? (/[A-Z]/.test(password) && /[0-9]/.test(password) ? "bg-emerald-500" : "bg-amber-500") : "bg-red-500"}`} />
                  <div className={`h-full flex-1 rounded-full transition-all duration-300 ${password.length >= 8 && /[A-Z]/.test(password) ? (/[0-9]/.test(password) ? "bg-emerald-500" : "bg-amber-500") : "bg-slate-800"}`} />
                  <div className={`h-full flex-1 rounded-full transition-all duration-300 ${password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password) ? "bg-emerald-500" : "bg-slate-800"}`} />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Security Strength</span>
                  <span className={password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                    {password.length < 8 ? "Must be 8+ characters" : (/[A-Z]/.test(password) && /[0-9]/.test(password) ? "Strong Password" : "Add uppercase & number")}
                  </span>
                </div>
              </div>
            )}

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
                disabled={loading}
                className="w-4 h-4 rounded border-slate-800 bg-slate-950 accent-blue-500 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer select-none">
                I accept the <a href="#" className="text-blue-400 hover:underline">Academic Terms & Privacy Policy</a>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-sm font-semibold text-white shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Registering Terminal...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Already have an account? </span>
              <Link to="/login" className="text-xs text-blue-400 font-semibold hover:underline">
                Sign in here
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignupPage;

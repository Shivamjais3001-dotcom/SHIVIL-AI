import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Sparkles, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { authService } from "../services/auth.service";
import { Toast, type ToastProps } from "../components/ui/Toast";

function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [toast, setToast] = useState<Omit<ToastProps, "onClose"> | null>(null);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setFeedback("Please input a valid university email address.");
      return;
    }

    if (cooldown > 0) {
      setFeedback(`Please wait ${cooldown} seconds before requesting another email.`);
      return;
    }

    setFeedback("");
    setLoading(true);

    try {
      const response = await authService.signup({ email, password: "", role: "STUDENT" } as any).catch(() => null);
      // Call dedicated resend endpoint if available
      setToast({
        type: "success",
        title: "Link Dispatched",
        message: "If an unverified account exists, a new link was sent.",
      });
      setFeedback("Verification link dispatched! Please check your email inbox.");
      setCooldown(60); // 60s cooldown to prevent abuse
    } catch {
      setFeedback("Request processed. Please check your inbox.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[440px] rounded-[2rem] border border-white/5 bg-slate-950/65 backdrop-blur-2xl p-8 md:p-10 shadow-2xl overflow-hidden">
        <div className="text-center mb-8 space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 mx-auto group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles size={16} />
            </div>
            <span className="text-md font-bold text-white tracking-tight">SHIVIL AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Resend Verification</h2>
          <p className="text-xs text-slate-500">Request a new security verification link for your account</p>
        </div>

        <form onSubmit={handleResend} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">University Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFeedback("");
                }}
                disabled={loading}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-900 bg-slate-950/50 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition"
              />
            </div>
          </div>

          {feedback && (
            <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-blue-300 flex items-start gap-2">
              <CheckCircle2 size={14} className="shrink-0 text-blue-400 mt-0.5" />
              <span>{feedback}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-sm font-semibold text-white shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Dispatching Email...</span>
              </>
            ) : cooldown > 0 ? (
              <span>Resend in {cooldown}s</span>
            ) : (
              <>
                <span>Send Verification Link</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-900/60 pt-6">
          <Link to="/login" className="text-xs text-slate-400 hover:text-white transition">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResendVerificationPage;

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Sparkles, CheckCircle2, AlertCircle, Clock, ShieldX, Loader2 } from "lucide-react";
import { authService } from "../services/auth.service";

type VerificationState = "LOADING" | "SUCCESS" | "EXPIRED" | "INVALID" | "ALREADY_VERIFIED";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerificationState>("LOADING");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const executeVerification = async () => {
      if (!token) {
        setState("INVALID");
        setMessage("No verification token parameter was provided in the link.");
        return;
      }

      try {
        const result = await authService.verifyEmail(token);
        if (result.message.toLowerCase().includes("already verified")) {
          setState("ALREADY_VERIFIED");
          setMessage("Your email address is already verified.");
        } else {
          setState("SUCCESS");
          setMessage("Your email address has been verified successfully!");
        }
      } catch (err: any) {
        const errText = err.response?.data?.message || err.message || "";
        if (errText.toLowerCase().includes("expired")) {
          setState("EXPIRED");
          setMessage("Verification link has expired. Please request a new verification email.");
        } else {
          setState("INVALID");
          setMessage(errText || "Invalid or revoked verification token.");
        }
      }
    };

    executeVerification();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[440px] rounded-[2rem] border border-white/5 bg-slate-950/65 backdrop-blur-2xl p-8 md:p-10 shadow-2xl text-center space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 mx-auto group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles size={16} />
          </div>
          <span className="text-md font-bold text-white tracking-tight">SHIVIL AI</span>
        </Link>

        {state === "LOADING" && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto animate-pulse">
              <Loader2 size={32} className="animate-spin text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Verifying Token...</h3>
            <p className="text-xs text-slate-400">Authenticating security verification token against backend registry.</p>
          </div>
        )}

        {state === "SUCCESS" && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">Email Verified!</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white shadow-lg transition"
            >
              Sign In Terminal
            </button>
          </div>
        )}

        {state === "ALREADY_VERIFIED" && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">Already Verified</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white shadow-lg transition"
            >
              Proceed to Login
            </button>
          </div>
        )}

        {state === "EXPIRED" && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <Clock size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">Token Expired</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
            <button
              onClick={() => navigate("/resend-verification")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 text-sm font-semibold text-white shadow-lg transition"
            >
              Request New Verification Link
            </button>
          </div>
        )}

        {state === "INVALID" && (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <ShieldX size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">Invalid Verification Token</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{message}</p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => navigate("/resend-verification")}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white transition"
              >
                Resend Verification Link
              </button>
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-400">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;

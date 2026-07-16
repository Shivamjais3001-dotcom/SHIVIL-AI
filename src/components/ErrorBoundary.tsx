import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, ShieldAlert } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 SHIVIL OS Crash Intercepted:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    localStorage.removeItem("students");
    localStorage.removeItem("faculty");
    localStorage.removeItem("shivil_seeded");
    window.location.href = "/dashboard";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 select-none font-sans text-slate-100 relative overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative w-full max-w-[460px] rounded-[2rem] border border-red-500/15 bg-slate-950/70 backdrop-blur-2xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto animate-pulse">
              <ShieldAlert size={22} />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-white">System Diagnostics Crash</h2>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                SHIVIL AI University OS intercepted a visual runtime render exception. Active registries state parameters are locked.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-950 text-left font-mono text-[9px] text-red-400 overflow-x-auto select-text max-h-24">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-850 cursor-pointer transition flex items-center gap-1.5"
              >
                <RefreshCw size={11} />
                <span>Reload Page</span>
              </button>
              
              <button
                onClick={this.handleReset}
                className="px-4.5 py-2 rounded-xl bg-gradient-to-r from-red-900/40 to-orange-950/40 border border-red-500/20 text-[10px] font-bold text-red-400 hover:text-white cursor-pointer transition"
              >
                Reset System Seeds
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

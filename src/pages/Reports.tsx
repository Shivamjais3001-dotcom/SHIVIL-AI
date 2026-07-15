import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { 
  BarChart3, 
  Download, 
  Sparkles, 
  FileSpreadsheet, 
  FileText,
  Loader2,
  CheckCircle2,
  FileDown,
  ArrowRight
} from "lucide-react";

function Reports() {
  const [compilingPlan, setCompilingPlan] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState("Click 'Synthesize Academic Audit' below to generate a real-time, AI-powered university summary report...");
  const [isTyping, setIsTyping] = useState(false);

  const reportItems = [
    {
      title: "Q3 Registration Registry",
      desc: "Enrollment metrics, branch allocations, and demographic statistics.",
      format: "CSV Ledger",
      size: "142 KB",
      icon: <FileSpreadsheet className="text-emerald-400" size={18} />
    },
    {
      title: "Term Attendance Summary",
      desc: "Shortage alerts, lecture check-ins, and department statistics.",
      format: "Excel Sheet",
      size: "248 KB",
      icon: <FileSpreadsheet className="text-blue-400" size={18} />
    },
    {
      title: "Academic Grade Curve Analysis",
      desc: "Projected GPA distribution, pass rates, and failure predictions.",
      format: "PDF Document",
      size: "1.2 MB",
      icon: <FileText className="text-purple-400" size={18} />
    }
  ];

  const handleDownload = (title: string, format: string) => {
    if (compilingPlan) return;
    setCompilingPlan(title);
    
    // Simulate generation latency
    setTimeout(() => {
      setCompilingPlan(null);
      setDownloadSuccess(`Successfully compiled and downloaded "${title}.${format.split(" ")[0].toLowerCase()}"`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    }, 1800);
  };

  const handleGenerateAIReport = () => {
    if (isTyping) return;
    setIsTyping(true);
    setAiReport("");
    
    const summaryText = "⚡ SHIVIL AI ACADEMIC SYSTEM AUDIT [Q3 2026]\n\n" + 
                        "1. REGISTRATION DATA: Active student registry stands at 12,450. CS enrollment holds 44% majority share.\n" +
                        "2. ATTENDANCE ISSUES: Overall attendance average is 88.5%. Low attendance alerts detected in Mechanical Engineering ( नेहा रेड्डी, अन्या सेन flagged).\n" +
                        "3. PLACEMENT PREDICTION: Recruitment cohort exhibits a 95% forecast alignment, showing record hiring offers in IT sectors.\n" +
                        "4. ACTION DIRECTIVE: Dispatch attendance warning notices immediately to avoid term exam exclusions.";

    let index = 0;
    const interval = setInterval(() => {
      if (index < summaryText.length) {
        setAiReport((prev) => prev + summaryText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 12);
  };

  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />
      
      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8 relative">
          
          {/* Download Success Toast */}
          {downloadSuccess && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-500/30 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl shadow-2xl">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <BarChart3 className="text-blue-500" size={28} />
                <span>Reports Compiler</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Compile academic metrics, audit logs, and finance ledger summaries instantly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Downloadable report cards (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-lg font-bold text-white">System Ledgers</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {reportItems.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 hover:border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] font-mono text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-900 font-bold">{item.format}</span>
                          <span className="text-[10px] font-mono text-slate-500">{item.size}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(item.title, item.format)}
                      disabled={compilingPlan !== null}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 shrink-0 self-start sm:self-auto"
                    >
                      {compilingPlan === item.title ? (
                        <>
                          <Loader2 size={12} className="animate-spin text-blue-400" />
                          <span>Compiling...</span>
                        </>
                      ) : (
                        <>
                          <Download size={12} />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Synthesizer console (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400 animate-pulse" />
                <span>AI Synthesis Engine</span>
              </h3>

              <div className="p-5 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/10 to-purple-950/10 space-y-4">
                <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 h-64 overflow-y-auto text-left flex flex-col justify-between">
                  <p className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {aiReport}
                    {isTyping && " ▊"}
                  </p>
                </div>

                <button
                  onClick={handleGenerateAIReport}
                  disabled={isTyping}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-xs font-bold text-white shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isTyping ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <span>Synthesize Academic Audit</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Reports;

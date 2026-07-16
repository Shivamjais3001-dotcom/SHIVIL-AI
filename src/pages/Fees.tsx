import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { 
  CreditCard, 
  DollarSign, 
  Sparkles, 
  CheckCircle2,
  TrendingUp,
  Sliders,
  Search,
  Building,
  FileDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Fees() {
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const metrics = {
    outstanding: "$120K",
    collected: "$1.2M",
    waivers: "$45K",
    efficiency: "94.2%"
  };

  const invoices = [
    { name: "Neha Reddy", roll: "APEX-2026-002", category: "Tuition Fees", amount: "$4,500", status: "Paid", date: "June 20" },
    { name: "Anya Sen", roll: "APEX-2026-044", category: "Hostel & Mess", amount: "$1,200", status: "Pending", date: "Due in 4 days" },
    { name: "Rohan Gupta", roll: "APEX-2026-118", category: "Tuition Fees", amount: "$4,500", status: "Paid", date: "June 24" }
  ];

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => inv.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [invoices, searchQuery]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="flex min-h-screen bg-[#030712] font-sans text-slate-100 selection:bg-blue-500/20 overflow-hidden h-screen select-none">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-full min-w-0">
        <div className="max-w-7xl mx-auto space-y-8 relative">
          
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-500/30 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl shadow-2xl"
              >
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <CreditCard className="text-emerald-500" size={26} />
                <span>Financial Ledger</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Manage invoices, collection logs, fee waivers, and outstanding dues.
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider shrink-0 self-start md:self-auto">
              <Sparkles size={12} className="animate-pulse" />
              <span>AI Revenue Forecast</span>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Collected revenue</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics.collected}</h3>
              <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold mt-2">
                <TrendingUp size={11} />
                <span>+12% vs last semester</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Outstanding Dues</p>
              <h3 className="text-2xl font-extrabold text-red-400 mt-2 font-mono">{metrics.outstanding}</h3>
              <div className="flex items-center gap-1 text-[9px] text-red-400/80 font-semibold mt-2">
                <span>Subject to active warnings</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Scholarship Waivers</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics.waivers}</h3>
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-2">
                <span>Authorized VC waiver slots</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Collection Efficiency</p>
              <h3 className="text-2xl font-extrabold text-blue-400 mt-2 font-mono">{metrics.efficiency}</h3>
              <div className="flex items-center gap-1 text-[9px] text-blue-400 font-semibold mt-2">
                <span>Target threshold: 95%</span>
              </div>
            </div>
          </div>

          {/* Split Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Invoices listings */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Trends chart */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Sliders size={14} className="text-emerald-400" />
                  <span>Revenue Collection Milestones</span>
                </h3>

                <div className="h-40 w-full pt-2">
                  <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#111827" strokeDasharray="3 3" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="#111827" strokeDasharray="3 3" />
                    <line x1="0" y1="130" x2="500" y2="130" stroke="#111827" strokeDasharray="3 3" />
                    <path d="M 0 110 Q 150 90 300 50 T 500 20" fill="none" stroke="#10b981" strokeWidth="2.5" />
                    <circle cx="300" cy="50" r="4" fill="#10b981" stroke="#030712" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Invoices logs search & list */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Invoices Registers</h3>
                  
                  <div className="relative group min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
                    <input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search student ledger..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-900 text-[10px] text-white focus:outline-none focus:border-slate-800 transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredInvoices.length === 0 ? (
                    <p className="text-center text-[10px] text-slate-500 py-6 font-medium">No ledger records matched.</p>
                  ) : (
                    filteredInvoices.map((inv, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900/60 flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <p className="text-xs font-bold text-white leading-none">{inv.name}</p>
                          <p className="text-[9px] text-slate-500 mt-1.5 leading-none">{inv.category} • {inv.roll}</p>
                        </div>
                        <div className="flex items-center gap-4.5">
                          <div className="text-right">
                            <span className="text-xs font-bold text-white font-mono block">{inv.amount}</span>
                            <span className="text-[8px] text-slate-500 font-medium font-mono">{inv.date}</span>
                          </div>
                          <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                            inv.status === "Paid" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Ledger actions */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-5 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-xl space-y-4 shadow-lg">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-slate-900">
                  <Building size={14} className="text-blue-400" />
                  <span>Dues warning dispatcher</span>
                </h3>

                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-2xl space-y-3">
                  <p className="text-[11px] font-bold text-white leading-none">Automated reminders queue</p>
                  <p className="text-[9px] text-slate-500 leading-normal">
                    AI filters pending invoices due in under 5 days and aggregates reminder email drafts automatically.
                  </p>
                  <button 
                    onClick={() => triggerToast("Dues payment reminders emailed successfully.")}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    Email Dues Reminders
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Fees;

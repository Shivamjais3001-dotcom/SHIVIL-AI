import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { 
  Book, 
  Sparkles, 
  CheckCircle2,
  Sliders,
  Search,
  BookOpen,
  FileDown,
  Clock,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Library() {
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const metrics = {
    checkouts: 1240,
    totalBooks: "42K Items",
    overdue: 12,
    reservations: 4
  };

  const libraryLogs = [
    { title: "Algorithms Core Textbook.pdf", borrower: "Neha Reddy", date: "June 20", status: "Returned" },
    { title: "Introduction to Artificial Intelligence", borrower: "Anya Sen", date: "Due in 2 days", status: "Borrowed" },
    { title: "Relativity Physics Manual", borrower: "Rohan Gupta", date: "Overdue by 3 days", status: "Overdue" }
  ];

  const filteredLogs = useMemo(() => {
    return libraryLogs.filter(log => log.title.toLowerCase().includes(searchQuery.toLowerCase()) || log.borrower.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [libraryLogs, searchQuery]);

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
                <Book className="text-purple-500" size={26} />
                <span>Library Catalog Center</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Reserve study books, monitor checkouts, check catalog counts, and send overdue notices.
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-500/20 bg-purple-500/5 text-[10px] text-purple-400 font-bold uppercase tracking-wider shrink-0 self-start md:self-auto">
              <Sparkles size={12} className="animate-pulse" />
              <span>AI Catalog Auditer</span>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active checkouts</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics.checkouts} Books</h3>
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-2.5">
                <span>99.8% database logs sync</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Catalog</p>
              <h3 className="text-2xl font-extrabold text-purple-400 mt-2 font-mono">{metrics.totalBooks}</h3>
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-2.5">
                <span>Includes e-books & guides</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Overdue Alerts</p>
              <h3 className="text-2xl font-extrabold text-red-400 mt-2 font-mono">{metrics.overdue} Items</h3>
              <div className="flex items-center gap-1 text-[9px] text-red-400/80 font-semibold mt-2.5">
                <span>Over 7 days delay</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reservations Queue</p>
              <h3 className="text-2xl font-extrabold text-blue-400 mt-2 font-mono">{metrics.reservations} Books</h3>
              <div className="flex items-center gap-1 text-[9px] text-blue-400 font-semibold mt-2.5">
                <span>Awaiting pickup cabin logs</span>
              </div>
            </div>
          </div>

          {/* Split Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Catalog list */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={14} className="text-blue-500" />
                    <span>Library checkout registers</span>
                  </h3>
                  
                  <div className="relative group min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
                    <input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search book or student..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-900 text-[10px] text-white focus:outline-none focus:border-slate-800 transition"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  {filteredLogs.length === 0 ? (
                    <p className="text-center text-[10px] text-slate-500 py-6 font-medium">No checkout items matched.</p>
                  ) : (
                    filteredLogs.map((log, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900/60 flex items-center justify-between flex-wrap gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate leading-none">{log.title}</p>
                          <p className="text-[9px] text-slate-500 mt-1.5 leading-none">Borrower: {log.borrower}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-semibold text-slate-400 font-mono">{log.date}</span>
                          <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                            log.status === "Returned" 
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                              : log.status === "Overdue" 
                              ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" 
                              : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-5 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-xl space-y-4 shadow-lg">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-slate-900">
                  <Sliders size={14} className="text-purple-400" />
                  <span>Library Operations</span>
                </h3>

                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-2xl space-y-3">
                  <p className="text-[11px] font-bold text-white leading-none">Dispatch Overdue Notices</p>
                  <p className="text-[9px] text-slate-500 leading-normal">
                    AI aggregates fine notices and overdue alerts for all students exceeding return thresholds.
                  </p>
                  <button 
                    onClick={() => triggerToast("Overdue return notices dispatched successfully.")}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    Send Overdue Notices
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

export default Library;

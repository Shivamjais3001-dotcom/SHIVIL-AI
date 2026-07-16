import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { 
  Award, 
  Briefcase, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Search, 
  Building,
  GraduationCap,
  ChevronRight,
  Sliders,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Placements() {
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const metrics = {
    avgPackage: "$12 LPA",
    placementRate: "86.5%",
    selectionRate: "78%",
    activeRecruiters: 42
  };

  const recruiters = [
    { name: "Google", category: "Software Engineer", vacancy: 12, status: "Ongoing" },
    { name: "Microsoft", category: "Product Manager", vacancy: 8, status: "Ongoing" },
    { name: "Adobe", category: "UX Designer", vacancy: 4, status: "Shortlist Released" }
  ];

  const students = [
    { name: "Neha Reddy", cgpa: 8.8, branch: "Computer Science", status: "Shortlisted" },
    { name: "Anya Sen", cgpa: 8.2, branch: "Information Tech", status: "Interview Pending" },
    { name: "Priya Patel", cgpa: 9.6, branch: "Computer Science", status: "Offered" }
  ];

  const filteredStudents = useMemo(() => {
    return students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [students, searchQuery]);

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
                <Briefcase className="text-purple-500" size={26} />
                <span>Placements Dashboard</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Monitor recruitment cycles, mock interview metrics, and selection rates.
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-500/20 bg-purple-500/5 text-[10px] text-purple-400 font-bold uppercase tracking-wider shrink-0 self-start md:self-auto">
              <Sparkles size={12} className="animate-pulse" />
              <span>AI Placements Forecast</span>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Package</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics.avgPackage}</h3>
              <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold mt-2">
                <TrendingUp size={11} />
                <span>+8% from last year</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Placement Rate</p>
              <h3 className="text-2xl font-extrabold text-purple-400 mt-2 font-mono">{metrics.placementRate}</h3>
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-2">
                <span>AI Projected Term Target</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Selection Rate</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics.selectionRate}</h3>
              <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold mt-2">
                <span>Optimized interview logs</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Active Recruiters</p>
              <h3 className="text-2xl font-extrabold text-blue-400 mt-2 font-mono">{metrics.activeRecruiters} Companies</h3>
              <div className="flex items-center gap-1 text-[9px] text-blue-400 font-semibold mt-2">
                <span>12 new MNC partners added</span>
              </div>
            </div>
          </div>

          {/* Split Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Recruiters list & interview lines */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Trends chart */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Sliders size={14} className="text-purple-400" />
                  <span>Hiring Trend & Selection Rates</span>
                </h3>

                <div className="h-40 w-full pt-2">
                  <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#111827" strokeDasharray="3 3" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="#111827" strokeDasharray="3 3" />
                    <line x1="0" y1="130" x2="500" y2="130" stroke="#111827" strokeDasharray="3 3" />
                    <path d="M 0 120 Q 150 80 300 40 T 500 30" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
                    <circle cx="300" cy="40" r="4" fill="#8b5cf6" stroke="#030712" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Candidates search & list */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Candidate Shortlists</h3>
                  
                  <div className="relative group min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={12} />
                    <input 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search shortlisted student..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-900 text-[10px] text-white focus:outline-none focus:border-slate-800 transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredStudents.length === 0 ? (
                    <p className="text-center text-[10px] text-slate-500 py-6 font-medium">No candidates matching search criteria.</p>
                  ) : (
                    filteredStudents.map((s, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900/60 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white leading-none">{s.name}</p>
                          <p className="text-[9px] text-slate-500 mt-1.5 leading-none">{s.branch} • CGPA {s.cgpa}</p>
                        </div>
                        <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border ${
                          s.status === "Offered" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                        }`}>
                          {s.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Recruitment schedules */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="p-5 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-xl space-y-4 shadow-lg">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-slate-900">
                  <Building size={14} className="text-blue-400" />
                  <span>Active Recruiter cycles</span>
                </h3>

                <div className="space-y-3.5">
                  {recruiters.map((rec, i) => (
                    <div key={i} className="p-3 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{rec.name}</span>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-blue-400 font-mono px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                          {rec.status}
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-none">Job profile: {rec.category} • {rec.vacancy} openings</p>
                      <button 
                        onClick={() => triggerToast(`Invite dispatch initiated for ${rec.name}.`)}
                        className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        Invite Candidates
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Placements;

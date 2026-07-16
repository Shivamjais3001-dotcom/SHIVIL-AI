import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";

import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  UserPlus,
  FilePlus,
  BarChart3,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  CreditCard,
  Home,
  Bot,
  AlertCircle,
  Bell,
  Search,
  CheckCircle2,
  FileText,
  Activity,
  Award,
  BookMarked,
  X,
  ShieldAlert,
  Sliders,
  DollarSign,
  Building,
  Heart,
  Briefcase,
  AlertTriangle,
  FolderOpen
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const [activeChartTab, setActiveChartTab] = useState<"admissions" | "departments" | "occupancy">("admissions");

  const activeRole = localStorage.getItem("userRole") || "Admin";
  const activeName = localStorage.getItem("adminName") || "Shivam Jaiswal";

  // Calculate dynamic greeting based on hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  // Format current date
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Mock Command Center data
  const healthScore = 92;
  const riskIndex = "2.4%";
  const budgetCollected = "$1.2M";
  const budgetGoal = "$1.5M";
  const placementRate = "86.5%";
  const dropoutRate = "1.8%";

  const approvals = [
    { id: 1, type: "Grading Curves", title: "Approve Midterm curves for CS-302 Algorithms", desc: "Dr. Sarah Jenkins submitted", priority: "High" },
    { id: 2, type: "Research Funding", title: "Approve $15,000 deep learning lab grant", desc: "Dean Office compiled", priority: "Medium" },
    { id: 3, type: "Tuition Invoices", title: "Lock Q3 mess allocation budget invoice", desc: "Finance cell compiled", priority: "Low" }
  ];

  const suggestions = [
    { title: "Balance CSE faculty loads", desc: "Professor Jenkins is overloaded by 4 hours. Reallocate Alg Lab." },
    { title: "Hostel block mess optimization", desc: "A Block daily checks show 15% surplus meals. Scale down mess count." }
  ];

  const emergencyAlerts = [
    { title: "Duplicate check-in signature", desc: "IP address collision logged in Algorithms lab Cabin 3." },
    { title: "Hostel Power backup caution", desc: "Generator fuel level registered below 25%." }
  ];

  const liveFeed = [
    { action: "Syllabus lock", detail: "IT-302 Cloud completed baseline audits", time: "5 mins ago" },
    { action: "Student Warning", detail: "Automated letter dispatched to Neha Reddy", time: "18 mins ago" },
    { action: "Grades upload", detail: "Midterm grading curves approved for ECE-202", time: "1 hour ago" },
    { action: "Fees paid", detail: "Tuition invoice settled by Roll APEX-2026-044", time: "3 hours ago" }
  ];

  return (
    <div className="flex min-h-screen bg-[#030712] font-sans overflow-x-hidden selection:bg-blue-500/20 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0">
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

          {/* Top Command Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                {formattedDate}
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1.5 flex items-center gap-2">
                <Sliders className="text-blue-500" size={24} />
                <span>University Command Center</span>
              </h1>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Welcome back, {activeName} ({activeRole}). Academic compliance, budgets, and predicted dropout ratios synced.
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-[10px] text-blue-400 font-bold uppercase tracking-wider select-none shrink-0 self-start md:self-auto">
              <Sparkles size={12} className="animate-pulse" />
              <span>VC / DEAN Executive Console</span>
            </div>
          </div>

          {/* SECTION: KPI Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Health Score */}
            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl group hover:border-slate-800 transition">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">University Health Score</span>
                <Heart size={14} className="text-red-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">{healthScore}/100</h3>
              <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold mt-2.5">
                <TrendingUp size={11} />
                <span>Excellent compliance baseline</span>
              </div>
            </div>

            {/* AI Risk Index */}
            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl group hover:border-slate-800 transition">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Risk index</span>
                <Sparkles size={14} className="text-purple-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-extrabold text-purple-400 mt-2 font-mono">{riskIndex} Dropout Risk</h3>
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-2.5">
                <span>Calculated on GPA / attendance logs</span>
              </div>
            </div>

            {/* Budget Insights */}
            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl group hover:border-slate-800 transition">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fees Collected</span>
                <DollarSign size={14} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">{budgetCollected} / {budgetGoal}</h3>
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-2.5">
                <span>80% collection efficiency baseline</span>
              </div>
            </div>

            {/* Placement Forecast */}
            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl group hover:border-slate-800 transition">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Placement Forecast</span>
                <Briefcase size={14} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-blue-400 mt-2 font-mono">{placementRate}</h3>
              <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold mt-2.5">
                <TrendingUp size={11} />
                <span>Projected by Placement Cell model</span>
              </div>
            </div>

          </div>

          {/* Main Command Split Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Columns (8 cols): Admissions charts, department comparison, VC Approvals */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Tabbed Executive Charts */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-6 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-900 pb-4 flex-wrap gap-3 select-none">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 size={14} className="text-blue-500" />
                    <span>Real-time Command Analytics</span>
                  </h3>

                  <div className="flex bg-slate-900 border border-slate-850 p-1 rounded-xl gap-1">
                    <button 
                      onClick={() => setActiveChartTab("admissions")}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        activeChartTab === "admissions" ? "bg-slate-950 text-blue-400 border border-white/5" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Admission Funnel
                    </button>
                    <button 
                      onClick={() => setActiveChartTab("departments")}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        activeChartTab === "departments" ? "bg-slate-950 text-purple-400 border border-white/5" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Departments
                    </button>
                    <button 
                      onClick={() => setActiveChartTab("occupancy")}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        activeChartTab === "occupancy" ? "bg-slate-950 text-emerald-400 border border-white/5" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Hostel & Mess
                    </button>
                  </div>
                </div>

                <div className="h-48 w-full">
                  <AnimatePresence mode="wait">
                    {activeChartTab === "admissions" && (
                      <motion.div key="admissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col justify-between pt-2">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                            <span>Applications Submitted</span>
                            <span className="text-white font-mono">4.8K Candidates</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: "100%" }} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                            <span>Offers Dispatched</span>
                            <span className="text-white font-mono">1.2K (25% rate)</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: "25%" }} />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                            <span>Registered & Enrolled</span>
                            <span className="text-white font-mono">820 Students (68% yield)</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: "17%" }} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeChartTab === "departments" && (
                      <motion.div key="departments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex items-center justify-around gap-4 pt-2">
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/25 flex items-center justify-center font-bold text-xs text-white font-mono shadow-md">
                            94%
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">CSE Utilization</p>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 rounded-full border-4 border-blue-500/25 flex items-center justify-center font-bold text-xs text-white font-mono shadow-md">
                            88%
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ECE Utilization</p>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 rounded-full border-4 border-purple-500/25 flex items-center justify-center font-bold text-xs text-white font-mono shadow-md">
                            82%
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ME Utilization</p>
                        </div>
                      </motion.div>
                    )}

                    {activeChartTab === "occupancy" && (
                      <motion.div key="occupancy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col justify-around pt-2">
                        <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-900 rounded-2xl">
                          <div>
                            <p className="text-xs font-bold text-white leading-none">Hostel Occupancy Index</p>
                            <p className="text-[9px] text-slate-500 mt-1 leading-none">Block A & B fully loaded</p>
                          </div>
                          <span className="text-xs font-bold text-emerald-400 font-mono">94.2% Occupied</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-900 rounded-2xl">
                          <div>
                            <p className="text-xs font-bold text-white leading-none">Mess Feedback Ratings</p>
                            <p className="text-[9px] text-slate-500 mt-1 leading-none">Average rating this week</p>
                          </div>
                          <span className="text-xs font-bold text-blue-400 font-mono">4.4 / 5.0 Rating</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* VC Approval Queue */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-5 shadow-lg">
                <div className="border-b border-slate-900 pb-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 select-none">
                    <CheckCircle2 size={14} className="text-emerald-400 animate-pulse" />
                    <span>VC Executive Approval Queue</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 leading-none">Requires authorized VC/Dean credentials log</p>
                </div>

                <div className="space-y-3">
                  {approvals.map(app => (
                    <div key={app.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-between flex-wrap gap-4 hover:border-slate-800 transition group/app">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wide font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 leading-none">
                            {app.type}
                          </span>
                          <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded leading-none ${
                            app.priority === "High" ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-slate-900 border-slate-800 text-slate-500"
                          }`}>
                            {app.priority} Priority
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white mt-2 truncate leading-none">{app.title}</p>
                        <p className="text-[9px] text-slate-500 mt-1.5 leading-none">{app.desc}</p>
                      </div>
                      <button 
                        onClick={() => triggerToast(`Authorized and approved: ${app.type}`)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-[10px] font-bold text-white cursor-pointer transition shrink-0"
                      >
                        Approve Dossier
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Columns (4 cols): Alerts, AI Recommendations, Live Feed */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Emergency Alerts & Proxy Caution */}
              <div className="p-5 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-xl space-y-4 shadow-lg">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider select-none">
                  <AlertTriangle size={14} className="text-red-400 animate-pulse" />
                  <span>Executive Alerts Feed</span>
                </h3>
                
                <div className="space-y-3">
                  {emergencyAlerts.map((alert, idx) => (
                    <div key={idx} className="p-3 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-1">
                      <p className="text-[10px] font-bold text-red-400 leading-none">{alert.title}</p>
                      <p className="text-[9px] text-slate-500 leading-normal mt-1">{alert.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Suggestions & Suggestions */}
              <div className="p-5 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-xl space-y-4 shadow-lg">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest select-none">
                  <Sparkles size={14} className="text-purple-400 animate-pulse" />
                  <span>AI Advisory Suggestions</span>
                </h3>
                
                <div className="space-y-3">
                  {suggestions.map((sug, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-950 border border-slate-900 rounded-2xl space-y-1 hover:border-slate-800 transition">
                      <p className="text-[11px] font-bold text-white leading-tight">{sug.title}</p>
                      <p className="text-[9px] text-slate-500 leading-relaxed mt-1">{sug.desc}</p>
                      <button 
                        onClick={() => triggerToast(`Proposal logged: ${sug.title}`)}
                        className="mt-2.5 text-[9px] font-bold text-purple-400 hover:text-white transition cursor-pointer"
                      >
                        Optimize Setup
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live University Feed */}
              <div className="p-5 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-xl space-y-4 shadow-lg">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest select-none">
                  <Activity size={14} className="text-blue-400 animate-pulse" />
                  <span>Live Command Feed</span>
                </h3>
                
                <div className="relative pl-4 border-l border-slate-900 space-y-4 ml-1">
                  {liveFeed.map((feed, idx) => (
                    <div key={idx} className="relative text-xs leading-none">
                      <span className="absolute -left-[20.5px] top-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <p className="font-semibold text-white leading-none">{feed.action}</p>
                      <p className="text-[9px] text-slate-500 leading-none mt-1.5">{feed.detail} • {feed.time}</p>
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

export default Dashboard;
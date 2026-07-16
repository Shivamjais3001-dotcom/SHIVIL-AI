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
  X
} from "lucide-react";

import StatCard from "../components/ui/StatCard";
import InsightCard from "../components/ui/InsightCard";
import { dashboardService, type DashboardStats } from "../services/dashboardService";

// Stagger variants for grid layout animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeChartTab, setActiveChartTab] = useState<"attendance" | "growth" | "dept" | "courses">("attendance");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

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

  // Fetch metrics dynamically on mount
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Dashboard stats fetch failed", err);
        setError("Failed to coordinate terminal statistics connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Adjust metrics based on role simulation
  const statsList = useMemo(() => {
    if (activeRole === "Student") {
      return [
        {
          title: "My Attendance",
          value: "92%",
          icon: <Calendar size={18} />,
          subtitle: "Required threshold (>75%)",
          trend: "Compliant"
        },
        {
          title: "Enrolled Courses",
          value: "6 Subjects",
          icon: <BookOpen size={18} />,
          subtitle: "Current semester III",
          trend: "Active"
        },
        {
          title: "Credits Weight",
          value: "24 Credits",
          icon: <Award size={18} />,
          subtitle: "Earned academic weight",
          trend: "Target: 22"
        },
        {
          title: "Pending Invoices",
          value: "$0.00",
          icon: <CreditCard size={18} />,
          subtitle: "Mess & tuition cleared",
          trend: "Paid"
        }
      ];
    }

    return [
      {
        title: "Active Students",
        value: loading ? "--" : stats?.activeStudents.toString() || "0",
        icon: <Users size={18} />,
        subtitle: "Total registered profiles",
        trend: "+12%"
      },
      {
        title: "Teaching Faculty",
        value: loading ? "--" : stats?.activeFaculty.toString() || "0",
        icon: <GraduationCap size={18} />,
        subtitle: "Total active professors",
        trend: "+5%"
      },
      {
        title: "Active Courses",
        value: loading ? "--" : stats?.totalCourses.toString() || "0",
        icon: <BookOpen size={18} />,
        subtitle: "Curriculum electives",
        trend: "Aligned"
      },
      {
        title: "Average Attendance",
        value: loading ? "--" : stats?.averageAttendance || "0%",
        icon: <Calendar size={18} />,
        subtitle: "Daily check-in average",
        trend: "+2%"
      }
    ];
  }, [activeRole, stats, loading]);

  // Adjust quick actions based on role simulation
  const quickActions = useMemo(() => {
    if (activeRole === "Student") {
      return [
        {
          title: "Tuition Fees",
          desc: "Pay messaging bills",
          path: "/fees",
          icon: <CreditCard size={16} />,
          color: "from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-400"
        },
        {
          title: "Library Catalog",
          desc: "Reserve study books",
          path: "/library",
          icon: <BookOpen size={16} />,
          color: "from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-400"
        },
        {
          title: "Mess & Hostel",
          desc: "Mess menu and warden info",
          path: "/hostel",
          icon: <Home size={16} />,
          color: "from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 text-emerald-400"
        },
        {
          title: "AI Help Terminal",
          desc: "Ask syllabus queries",
          path: "/assistant",
          icon: <Bot size={16} />,
          color: "from-pink-500/10 to-pink-600/10 border-pink-500/20 text-pink-400"
        }
      ];
    }

    return [
      {
        title: "Register Student",
        desc: "Add new record",
        path: "/students",
        icon: <UserPlus size={16} />,
        color: "from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-400"
      },
      {
        title: "Add Faculty Member",
        desc: "Create instructor profile",
        path: "/faculty",
        icon: <GraduationCap size={16} />,
        color: "from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-400"
      },
      {
        title: "Create New Course",
        desc: "Syllabus builder",
        path: "/courses",
        icon: <FilePlus size={16} />,
        color: "from-pink-500/10 to-pink-600/10 border-pink-500/20 text-pink-400"
      },
      {
        title: "Export Metrics",
        desc: "Result audit log",
        path: "/reports",
        icon: <BarChart3 size={16} />,
        color: "from-amber-500/10 to-amber-600/10 border-amber-500/20 text-amber-400"
      }
    ];
  }, [activeRole]);

  // Command palette search shortcut alert toggle
  const triggerCommandPalette = () => {
    const kEvent = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      metaKey: true,
      bubbles: true
    });
    window.dispatchEvent(kEvent);
  };

  return (
    <div className="flex min-h-screen bg-[#030712] font-sans overflow-x-hidden selection:bg-blue-500/20 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0">
        <div className="max-w-7xl mx-auto space-y-8 relative">
          
          {/* Top Control Bar (Search, Notification Panel Trigger) */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-900 pb-5">
            {/* Command Palette Trigger Input */}
            <div 
              onClick={triggerCommandPalette}
              className={`relative flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-950/40 border transition-all duration-300 cursor-pointer w-full max-w-sm select-none ${
                searchFocused ? "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "border-white/5 hover:border-slate-800"
              }`}
            >
              <Search className="text-slate-500" size={15} />
              <span className="text-xs text-slate-500 flex-1">Type AI command or search details...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-500">
                ⌘K
              </kbd>
            </div>

            {/* Notification Ring & AI Badge */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative w-9 h-9 rounded-xl border border-white/5 bg-slate-950/40 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-800 transition duration-200 cursor-pointer"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
              </button>

              <div className="hidden md:flex items-center gap-2.5 px-4 py-2 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400 font-semibold shadow-inner shadow-blue-500/10">
                <Sparkles size={13} className="animate-pulse" />
                <span>{activeRole === "Student" ? "AI Companion Active" : "AI Auditor Online"}</span>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-center gap-3"
            >
              <AlertCircle size={18} className="shrink-0 animate-pulse" />
              <span className="font-semibold">{error}</span>
            </motion.div>
          )}

          {/* 1. AI Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950/60 p-6 md:p-8 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row justify-between gap-6 group"
          >
            {/* Radial background glowing accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl opacity-60 pointer-events-none group-hover:opacity-80 transition duration-500" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl opacity-30 pointer-events-none" />

            <div className="space-y-4 max-w-xl relative">
              <span className="text-[11px] font-bold text-blue-400 tracking-widest uppercase">{formattedDate}</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
                  {greeting}, {activeName.split(" ")[0]} 👋
                </h1>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {activeRole === "Student" 
                    ? "Welcome to your student terminal. Your classes are aligned, and the AI evaluation advisor is active." 
                    : "Shivil Operating System reports that university registries, ledgers, and grading engines are fully synced."}
                </p>
              </div>

              {/* AI Generated summary bubble */}
              <div className="p-4.5 rounded-2xl bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-500/10 flex items-start gap-3">
                <Sparkles size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">AI OS Summary:</span>{" "}
                  {activeRole === "Student"
                    ? "Today you have 2 lectures. Attendance remains compliant at 92%. A physics elective option has been computed."
                    : `Today the university has 42 scheduled lectures, ${stats?.activeStudents ? stats.activeStudents * 2 : 18} attendance checks, and 3 marks moderation approvals awaiting review.`}
                </p>
              </div>
            </div>

            {/* AI Shortcut Suggestions */}
            <div className="flex flex-col justify-end gap-3.5 self-stretch md:w-64 relative">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Suggestions</span>
              
              <div className="space-y-2">
                <button 
                  onClick={() => navigate("/assistant")}
                  className="w-full text-left p-3.5 rounded-xl border border-white/5 bg-slate-900/40 text-xs text-slate-300 hover:text-white hover:border-blue-500/20 hover:bg-slate-900/70 transition duration-200 cursor-pointer flex items-center justify-between group/btn"
                >
                  <span>Syllabus analysis report</span>
                  <ArrowRight size={13} className="text-slate-500 group-hover/btn:translate-x-0.5 group-hover/btn:text-blue-400 transition" />
                </button>
                <button 
                  onClick={() => navigate(activeRole === "Student" ? "/attendance" : "/reports")}
                  className="w-full text-left p-3.5 rounded-xl border border-white/5 bg-slate-900/40 text-xs text-slate-300 hover:text-white hover:border-purple-500/20 hover:bg-slate-900/70 transition duration-200 cursor-pointer flex items-center justify-between group/btn"
                >
                  <span>Verify attendance trends</span>
                  <ArrowRight size={13} className="text-slate-500 group-hover/btn:translate-x-0.5 group-hover/btn:text-purple-400 transition" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* 2. Smart Statistics Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {statsList.map((stat, idx) => (
              <StatCard
                key={idx}
                idx={idx}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                subtitle={stat.subtitle}
                trend={stat.trend}
              />
            ))}
          </motion.div>

          {/* Central Grid: Dynamic Charts Area & Notifications Drawer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 4. Analytics Area (8 cols) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-8 rounded-3xl border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl space-y-6 relative overflow-hidden group shadow-lg"
            >
              {/* Radial card glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity size={16} className="text-blue-400" />
                    <span>{activeRole === "Student" ? "My Academic Charts" : "University Analytical Core"}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Interactive SVG rendering updated dynamically
                  </p>
                </div>
                
                {/* Modern tab control */}
                <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
                  <button 
                    onClick={() => setActiveChartTab("attendance")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                      activeChartTab === "attendance" ? "bg-slate-950 text-blue-400 border border-white/5 shadow-inner" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Attendance
                  </button>
                  <button 
                    onClick={() => setActiveChartTab("growth")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                      activeChartTab === "growth" ? "bg-slate-950 text-purple-400 border border-white/5 shadow-inner" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Growth
                  </button>
                  <button 
                    onClick={() => setActiveChartTab("dept")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                      activeChartTab === "dept" ? "bg-slate-950 text-pink-400 border border-white/5 shadow-inner" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Departments
                  </button>
                </div>
              </div>

              {/* Dynamic SVG Charts with pathLength animations */}
              <div className="h-56 relative w-full pt-4">
                <AnimatePresence mode="wait">
                  {activeChartTab === "attendance" && (
                    <motion.div
                      key="attendance"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="attGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="40" x2="500" y2="40" stroke="#111827" strokeDasharray="3 3" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="#111827" strokeDasharray="3 3" />
                        <line x1="0" y1="160" x2="500" y2="160" stroke="#111827" strokeDasharray="3 3" />

                        {/* Line Area */}
                        <path 
                          d="M0,160 L0,120 Q80,80 160,110 T320,60 Q400,90 480,50 L500,45 L500,200 L0,200 Z" 
                          fill="url(#attGlow)"
                        />

                        {/* Path Line */}
                        <motion.path 
                          d="M0,120 Q80,80 160,110 T320,60 Q400,90 480,50 L500,45" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="2.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                        <circle cx="160" cy="110" r="4.5" fill="#3b82f6" stroke="#030712" strokeWidth="2" />
                        <circle cx="320" cy="60" r="4.5" fill="#a78bfa" stroke="#030712" strokeWidth="2" />
                      </svg>
                    </motion.div>
                  )}

                  {activeChartTab === "growth" && (
                    <motion.div
                      key="growth"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                        <line x1="0" y1="50" x2="500" y2="50" stroke="#111827" strokeDasharray="3 3" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="#111827" strokeDasharray="3 3" />
                        <line x1="0" y1="150" x2="500" y2="150" stroke="#111827" strokeDasharray="3 3" />

                        {/* Glowing vertical bar graphs */}
                        <motion.rect x="40" y="140" width="24" height="60" rx="4" fill="url(#growthGrad)" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="origin-bottom" transition={{ duration: 0.5 }} />
                        <motion.rect x="130" y="110" width="24" height="90" rx="4" fill="url(#growthGrad)" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="origin-bottom" transition={{ duration: 0.5, delay: 0.1 }} />
                        <motion.rect x="220" y="90" width="24" height="110" rx="4" fill="url(#growthGrad)" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="origin-bottom" transition={{ duration: 0.5, delay: 0.2 }} />
                        <motion.rect x="310" y="70" width="24" height="130" rx="4" fill="url(#growthGrad)" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="origin-bottom" transition={{ duration: 0.5, delay: 0.3 }} />
                        <motion.rect x="400" y="40" width="24" height="160" rx="4" fill="url(#growthGrad)" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="origin-bottom" transition={{ duration: 0.5, delay: 0.4 }} />

                        <defs>
                          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  )}

                  {activeChartTab === "dept" && (
                    <motion.div
                      key="dept"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                        <line x1="0" y1="40" x2="500" y2="40" stroke="#111827" strokeDasharray="3 3" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="#111827" strokeDasharray="3 3" />
                        <line x1="0" y1="160" x2="500" y2="160" stroke="#111827" strokeDasharray="3 3" />

                        {/* Radial concentric rings representation */}
                        <motion.circle cx="250" cy="100" r="70" fill="none" stroke="#ec4899" strokeWidth="6" strokeDasharray="440" initial={{ strokeDashoffset: 440 }} animate={{ strokeDashoffset: 120 }} transition={{ duration: 1 }} />
                        <motion.circle cx="250" cy="100" r="50" fill="none" stroke="#8b5cf6" strokeWidth="6" strokeDasharray="314" initial={{ strokeDashoffset: 314 }} animate={{ strokeDashoffset: 70 }} transition={{ duration: 1, delay: 0.2 }} />
                        <motion.circle cx="250" cy="100" r="30" fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="188" initial={{ strokeDashoffset: 188 }} animate={{ strokeDashoffset: 30 }} transition={{ duration: 1, delay: 0.4 }} />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chart Legend */}
              <div className="flex flex-wrap gap-6 text-[10px] font-mono text-slate-500 pt-4 border-t border-slate-900">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{activeRole === "Student" ? "Lectures & Lab Attendance" : "CSE Engineering"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>{activeRole === "Student" ? "Physics Electives" : "Information Tech"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>{activeRole === "Student" ? "Self Study Tasks" : "ECE Department"}</span>
                </div>
              </div>
            </motion.div>

            {/* Schedule Queue Panel (4 cols) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-4 rounded-3xl border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl flex flex-col justify-between h-[360px] shadow-lg"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
                  <Clock size={15} className="text-purple-400" />
                  <span>Operational Queue</span>
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-2xl flex gap-3">
                    <div className="w-1.5 rounded bg-purple-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">09:00 AM - 10:30 AM</p>
                      <p className="text-xs font-semibold text-white mt-0.5">CS-302 Advanced Algorithms</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Dr. Sarah Jenkins • Room 402</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/30 border border-slate-900/60 rounded-2xl flex gap-3">
                    <div className="w-1.5 rounded bg-blue-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">11:00 AM - 12:30 PM</p>
                      <p className="text-xs font-semibold text-slate-300 mt-0.5">Cloud Architecture Lab</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Prof. Marcus Vance • Lab A</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate("/assistant")}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-500/10 text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                <span className="font-semibold text-[11px]">Require AI Scheduling? Ask AI</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>

          </div>

          {/* AI Insights & Quick Action Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* 3. AI Insights Panel (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
                <Sparkles size={16} className="text-blue-400" />
                <span>Live AI Performance Insights</span>
              </h3>
              
              <div className="space-y-4">
                {activeRole === "Student" ? (
                  <InsightCard
                    title="Academic Projection"
                    description="Your current GPA stands strong at 8.85 with a perfect attendance streak. To cross the 9.0 target, we recommend adding the Physics Elective course. The scheduling engine reports no time conflicts."
                    action="Enroll in physics elective"
                    onAction={() => navigate("/courses")}
                    idx={0}
                  />
                ) : (
                  <>
                    <InsightCard
                      title="Syllabus coverage bottleneck: IT Branch"
                      description="AI Audit logs indicate IT-302 Cloud Development syllabus coverage is running 15% behind calendar expectations. Recommended action: Auto-schedule extra lab hour."
                      action="Auto-Schedule Hour"
                      onAction={() => navigate("/courses")}
                      idx={0}
                    />
                    <InsightCard
                      title="Attendance anomaly alert"
                      description="Two students are predicted to drop below 75% eligibility mark (Neha Reddy, Anya Sen). Automated notification warning letters drafted for review."
                      action="Send AI letters"
                      onAction={() => navigate("/attendance")}
                      idx={1}
                    />
                  </>
                )}
              </div>
            </div>

            {/* 6. Quick Action Center (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <h3 className="text-lg font-bold text-white tracking-tight">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                
                {quickActions.map((action, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(action.path)}
                    className="p-4.5 rounded-2xl bg-slate-950/45 border border-slate-900 hover:border-slate-800 transition duration-200 cursor-pointer flex flex-col justify-between h-28 group shadow"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                      {action.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white tracking-tight leading-none">{action.title}</p>
                      <p className="text-[9px] text-slate-500 mt-1 leading-tight">{action.desc}</p>
                    </div>
                  </motion.div>
                ))}

              </div>
            </div>

          </div>

          {/* 5. Live Activity Timeline Feed */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl space-y-6 shadow"
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-pink-400" />
              <span>Live Terminal Activity Feed</span>
            </h3>

            <div className="relative pl-6 border-l border-slate-900 space-y-6 ml-2 text-xs">
              <div className="relative">
                <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                </span>
                <p className="font-semibold text-white leading-none">New student enrolled in IT curriculum</p>
                <p className="text-[10px] text-slate-500 mt-1">APEX-2026-002 • Rohit Sharma • 2 minutes ago</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                </span>
                <p className="font-semibold text-white leading-none">Faculty syllabus upload verified</p>
                <p className="text-[10px] text-slate-500 mt-1">CS-301 Artificial Intelligence syllabusOutcomes v3 • 1 hour ago</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[30px] top-0 w-4 h-4 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                <p className="font-semibold text-white leading-none">Daily attendance metrics coordinated</p>
                <p className="text-[10px] text-slate-500 mt-1">Check-in index: 88.5% compliance threshold • Today</p>
              </div>
            </div>
          </motion.div>

          {/* 7. Notification Panel (Drawer Overlay) */}
          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                {/* Backdrop overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsNotificationsOpen(false)}
                  className="fixed inset-0 z-40 bg-black"
                />

                {/* Sliding panel */}
                <motion.div 
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 w-80 md:w-96 bg-slate-950 border-l border-white/5 z-50 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-3xl"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Bell size={15} className="text-blue-400" />
                        <span>System Notifications</span>
                      </h3>
                      <button 
                        onClick={() => setIsNotificationsOpen(false)}
                        className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-purple-400">AI Recommendation</span>
                        <p className="text-xs font-semibold text-white mt-1">Audit Supplementary Schedules</p>
                        <p className="text-[10px] text-slate-500 leading-normal">The engine predicts 3 scheduling overlaps if supplementary exams are set for next Friday.</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-blue-400">Security Audit</span>
                        <p className="text-xs font-semibold text-white mt-1">API Key Rotated</p>
                        <p className="text-[10px] text-slate-500 leading-normal">Google integration access credentials rotated successfully by user superadmin@shivil.ai.</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-pink-400">Announcements</span>
                        <p className="text-xs font-semibold text-white mt-1">Tuition ledgers initialized</p>
                        <p className="text-[10px] text-slate-500 leading-normal">Semester V ledger receipt reports compiled. Tuition clearing verified for 94.5% cohort.</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setIsNotificationsOpen(false);
                      navigate("/settings");
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-400 hover:text-white border border-white/5 transition text-center cursor-pointer"
                  >
                    Manage Notification Profiles
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;
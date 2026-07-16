import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../components/Sidebar";
import { apiClient } from "../api/client";

import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
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
  X,
  ShieldAlert,
  Sliders,
  DollarSign,
  Building,
  Briefcase,
  AlertTriangle,
  Send,
  Play,
  Heart,
  Info,
  Layers,
  Zap,
  CheckCircle,
  Settings
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const [activeChartTab, setActiveChartTab] = useState<"admissions" | "departments" | "occupancy">("admissions");
  const [chartTimeRange, setChartTimeRange] = useState<"Week" | "Month" | "Year">("Month");
  
  // UI Panels toggles
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");
  const [showAssistant, setShowAssistant] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState<"Critical" | "Warning" | "Info" | "Resolved">("Critical");
  
  // AI Assistant chat history
  const [assistantMessages, setAssistantMessages] = useState<Array<{ role: "user" | "assistant", text: string }>>([
    { role: "assistant", text: "Welcome to SHIVIL AI Executive Copilot. Ask me anything about student risk metrics, attendance compliance, or budget audits." }
  ]);
  const [assistantInput, setAssistantInput] = useState("");
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);

  // Sync timers
  const [lastSyncSec, setLastSyncSec] = useState(0);
  const [systemUptimeSec, setSystemUptimeSec] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const activeRole = localStorage.getItem("userRole") || "Admin";
  const activeName = localStorage.getItem("adminName") || "Shivam Jaiswal";

  // Fetch live metrics from PostgreSQL via Express backend
  const { data: metricsResponse, refetch: refetchMetrics } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: async () => {
      const res = await apiClient.get("/dashboard/metrics");
      return res.data;
    }
  });

  const metricsData = useMemo(() => {
    return metricsResponse?.data || {
      studentsCount: 1240,
      facultyCount: 142,
      departmentsCount: 4,
      averageAttendance: 94.2,
      upcomingExamsCount: 6,
      pendingTasks: 3,
      activeConversations: 12
    };
  }, [metricsResponse]);

  // Loading skeleton simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Timer intervals for sync & uptime stats
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSyncSec(prev => prev + 1);
      setSystemUptimeSec(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen to keyboard shortcut Ctrl+K / Cmd+K for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandMenu(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSyncReset = () => {
    refetchMetrics();
    setLastSyncSec(0);
    triggerToast("ERP operational indices synchronized successfully.");
  };

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }, []);

  // Executive summaries and Command Center stats
  const healthScore = 98.6;
  const riskIndex = "2.4%";
  const budgetCollected = "$1.24M";
  const budgetGoal = "$1.50M";
  const placementRate = "94.2%";

  // Executive Approval queue dossiers
  const [approvalsList, setApprovalsList] = useState([
    { id: 1, type: "Grading Curves", title: "Approve Midterm curves for CS-302 Algorithms", desc: "Dr. Sarah Jenkins submitted. Standard deviation curve matches parameters.", priority: "High", deadline: "Today, 17:00", impact: "Affects 60 Students" },
    { id: 2, type: "Research Funding", title: "Approve $15,000 deep learning lab grant", desc: "Dean Office compiled. Sourced from external science grant allocation.", priority: "Medium", deadline: "July 18, 12:00", impact: "Affects CSE Research" },
    { id: 3, type: "Tuition Invoices", title: "Lock Q3 mess allocation budget invoice", desc: "Finance cell compiled. Covers catering supply and vendor settlements.", priority: "Low", deadline: "July 20, 18:00", impact: "Affects Hostel Accounts" }
  ]);

  // Executive Notifications Center
  const notificationsList = [
    { id: 1, cat: "Critical", title: "Duplicate check-in signature", desc: "IP address collision logged in Algorithms lab Cabin 3.", time: "12m ago" },
    { id: 2, cat: "Critical", title: "Dropout Risk Spike", desc: "Roll No APEX-2026-002 attendance dropped to 58%.", time: "25m ago" },
    { id: 3, cat: "Warning", title: "Hostel Power backup caution", desc: "Generator fuel level registered below 25%.", time: "1h ago" },
    { id: 4, cat: "Warning", title: "IP Proxy Alert", desc: "Student check-in logged from duplicate external VPN tunnel.", time: "2h ago" },
    { id: 5, cat: "Info", title: "Syllabus compliance compiled", desc: "IT-302 Cloud completed baseline audits.", time: "3h ago" },
    { id: 6, cat: "Info", title: "New registration dossier", desc: "15 new applications added to registration database.", time: "5h ago" },
    { id: 7, cat: "Resolved", title: "Database cluster resync", desc: "Internal Prisma engines index cache optimization completed.", time: "Yesterday" }
  ];

  // AI Insight Recommendation Panel
  const aiInsight = {
    title: "Balance CSE faculty teaching workloads",
    recommendation: "Reallocate CS-302 Algorithms Lab from Dr. Sarah Jenkins to Prof. Marcus Vance.",
    reasoning: "Dr. Jenkins is overloaded by 4 hours beyond guidelines, impacting response cycles. Prof. Vance has a 4-hour deficit in workload allocation.",
    impact: "Reduces grading latency by projected 1.5 days. Retains syllabus progression targets.",
    confidence: 96,
    actionLabel: "Reallocate Workload"
  };

  const liveFeed = [
    { action: "Syllabus lock", detail: "IT-302 Cloud completed baseline audits", time: "5 mins ago", severity: "Info" },
    { action: "Student Warning", detail: "Automated letter dispatched to Neha Reddy", time: "18 mins ago", severity: "Warning" },
    { action: "Grades upload", detail: "Midterm grading curves approved for ECE-202", time: "1 hour ago", severity: "Resolved" },
    { action: "Fees paid", detail: "Tuition invoice settled by Roll APEX-2026-044", time: "3 hours ago", severity: "Info" },
    { action: "Security Alert", detail: "Multiple failed SSO attempts from outside IP block", time: "4 hours ago", severity: "Critical" }
  ];

  const handleApproveDossier = (id: number, title: string) => {
    setApprovalsList(prev => prev.filter(item => item.id !== id));
    triggerToast(`Dossier Approved: ${title}`);
  };

  // Chatbot response simulation
  const handleSendAssistantMessage = () => {
    if (!assistantInput.trim()) return;
    const userMsg = assistantInput;
    setAssistantMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setAssistantInput("");
    setIsAssistantTyping(true);

    setTimeout(() => {
      setIsAssistantTyping(false);
      let replyText = "Analyzing parameters... ";
      if (userMsg.toLowerCase().includes("dropout") || userMsg.toLowerCase().includes("risk")) {
        replyText += "I have scanned CSE rosters. 1 student (Neha Reddy, CS-302) is flagged at 88% dropout risk index due to a 58% attendance record. I recommend triggering the automated warning dispatch.";
      } else if (userMsg.toLowerCase().includes("attendance") || userMsg.toLowerCase().includes("cse")) {
        replyText += "CS Department attendance index is 94.2%. Average check-ins are stable. 2 warnings were dispatched this week to ECE department students.";
      } else {
        replyText += "AI query compiled successfully. Your request matches context: Viewing University Command Center indices. Let me know if you need to run specific database audits.";
      }
      setAssistantMessages(prev => [...prev, { role: "assistant", text: replyText }]);
    }, 1200);
  };

  // Command Menu execute action helper
  const handleCommandExecute = (actionName: string) => {
    setShowCommandMenu(false);
    setCommandSearch("");
    if (actionName === "dropout") {
      setShowAssistant(true);
      setAssistantInput("Analyze dropout risks");
      setTimeout(() => handleSendAssistantMessage(), 100);
    } else if (actionName === "audit") {
      triggerToast("Triggered attendance verification scan.");
    } else if (actionName === "notice") {
      triggerToast("Dispatched warning notifications to parent roster.");
    } else {
      triggerToast("System theme resynced.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030712] font-sans overflow-x-hidden selection:bg-blue-500/20 text-slate-100 relative">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0 z-10 relative">
        
        {/* Glow meshes */}
        <div className="absolute top-[-5%] left-[20%] w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

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
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION: Dynamic Executive Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                <span>{formattedDate}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Uptime: {Math.floor(systemUptimeSec)}s</span>
                </span>
                <span>•</span>
                <button 
                  onClick={handleSyncReset}
                  className="hover:text-blue-400 transition cursor-pointer flex items-center gap-1 text-[9px] font-bold"
                >
                  <span>Synced {lastSyncSec}s ago</span>
                </button>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1.5 flex items-center gap-2.5">
                <Sliders className="text-blue-500" size={24} />
                <span>AI Executive Command Center</span>
              </h1>
              
              <div className="p-3.5 mt-3 rounded-2xl border border-white/5 bg-slate-950/60 text-xs text-slate-400 leading-relaxed max-w-4xl border-l-2 border-l-blue-500 select-text">
                <span className="font-extrabold text-white uppercase tracking-wider text-[10px] mr-1.5 block md:inline">VC Daily Recap:</span>
                Campus health indexes remain stable at 98.6%. Algorithms CS-302 midterm curves require dossier sign-offs. AI models have logged 1 high-risk student profile.
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 self-start md:self-auto">
              <button 
                onClick={() => setShowNotificationCenter(true)}
                className="relative p-2.5 rounded-xl border border-white/5 bg-slate-950/80 hover:border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <Bell size={15} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              </button>

              <button 
                onClick={() => setShowCommandMenu(true)}
                className="px-4 py-2.5 rounded-xl border border-white/5 bg-slate-950/80 hover:border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-2 shadow"
              >
                <Search size={14} />
                <span>Search</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-bold font-mono">Ctrl+K</kbd>
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-[9px] font-extrabold text-blue-400 uppercase tracking-widest select-none font-mono">
                <Sparkles size={11} className="animate-spin duration-1500" />
                <span>AI Operating Mode Active</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            /* Skeleton Loading State */
            <div className="space-y-8 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-slate-950/40 border border-white/5" />
                ))}
              </div>
              <div className="h-64 rounded-3xl bg-slate-950/40 border border-white/5" />
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* SECTION: KPI Metric Highlights with Sparklines & predictions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Health Score */}
                <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl group hover:border-slate-800 transition shadow flex flex-col justify-between h-36">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Health Index</span>
                    <Heart size={14} className="text-red-400 animate-pulse" />
                  </div>
                  <div className="my-1">
                    <h3 className="text-2xl font-extrabold text-white font-mono">{healthScore}%</h3>
                    <div className="h-5 w-full mt-2">
                      <svg className="w-full h-full stroke-emerald-500/40 fill-none" viewBox="0 0 100 20">
                        <path d="M0,12 Q15,18 30,12 T60,5 T90,9 T100,2" strokeWidth="1.8" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5"><TrendingUp size={9} />+1.2%</span>
                    <span className="text-slate-500 font-semibold uppercase font-mono">Prediction: Stable</span>
                  </div>
                </div>

                {/* AI Risk Index */}
                <div className="relative rounded-2xl border border-purple-500/15 bg-slate-950/40 p-5 backdrop-blur-xl group hover:border-purple-500/30 transition shadow flex flex-col justify-between h-36">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">AI Risk Index</span>
                    <Sparkles size={14} className="text-purple-400" />
                  </div>
                  <div className="my-1">
                    <h3 className="text-2xl font-extrabold text-purple-400 font-mono">{riskIndex}</h3>
                    <div className="h-5 w-full mt-2">
                      <svg className="w-full h-full stroke-purple-500/40 fill-none" viewBox="0 0 100 20">
                        <path d="M0,5 Q20,15 40,8 T70,12 T100,4" strokeWidth="1.8" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-purple-400 font-bold">1 Alert Flagged</span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[8px] font-bold text-red-400 uppercase">Attention</span>
                  </div>
                </div>

                {/* Budget Insights */}
                <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl group hover:border-slate-800 transition shadow flex flex-col justify-between h-36">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fees Collection</span>
                    <DollarSign size={14} className="text-emerald-400" />
                  </div>
                  <div className="my-1">
                    <h3 className="text-2xl font-extrabold text-white font-mono">{budgetCollected}</h3>
                    <div className="h-5 w-full mt-2">
                      <svg className="w-full h-full stroke-emerald-500/40 fill-none" viewBox="0 0 100 20">
                        <path d="M0,18 Q20,12 40,15 T75,6 T100,2" strokeWidth="1.8" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-slate-500">Goal: {budgetGoal}</span>
                    <span className="text-emerald-400 font-bold">82% yield</span>
                  </div>
                </div>

                {/* Placement Forecast */}
                <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl group hover:border-slate-800 transition shadow flex flex-col justify-between h-36">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Placement Forecast</span>
                    <Briefcase size={14} className="text-blue-400" />
                  </div>
                  <div className="my-1">
                    <h3 className="text-2xl font-extrabold text-blue-400 font-mono">{placementRate}</h3>
                    <div className="h-5 w-full mt-2">
                      <svg className="w-full h-full stroke-blue-500/40 fill-none" viewBox="0 0 100 20">
                        <path d="M0,15 Q30,10 60,14 T100,5" strokeWidth="1.8" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5"><TrendingUp size={9} />+4.1%</span>
                    <span className="text-slate-500">Projected yield</span>
                  </div>
                </div>

              </div>

              {/* Active Registries Counts Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-slate-900 py-5 select-none bg-slate-950/20 px-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Total Students</p>
                    <p className="text-sm font-extrabold text-white mt-1.5 leading-none font-mono">{metricsData.studentsCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Total Faculty</p>
                    <p className="text-sm font-extrabold text-white mt-1.5 leading-none font-mono">{metricsData.facultyCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                    <Building size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Active Departments</p>
                    <p className="text-sm font-extrabold text-white mt-1.5 leading-none font-mono">{metricsData.departmentsCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Activity size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">Avg Attendance</p>
                    <p className="text-sm font-extrabold text-white mt-1.5 leading-none font-mono">{metricsData.averageAttendance}%</p>
                  </div>
                </div>
              </div>

              {/* Main Command Split Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Columns (8 cols): Admissions charts, VC Approvals */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Tabbed Executive Charts with Range Selection */}
                  <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-6 shadow-lg relative">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
                    
                    <div className="flex items-center justify-between border-b border-slate-900 pb-4 flex-wrap gap-4 select-none">
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <BarChart3 size={14} className="text-blue-500" />
                          <span>Real-time Command Analytics</span>
                        </h3>
                        <p className="text-[9px] text-slate-500 font-semibold">Interactive index mapping</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Time Range Selector */}
                        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-850">
                          {["Week", "Month", "Year"].map(t => (
                            <button
                              key={t}
                              onClick={() => setChartTimeRange(t as any)}
                              className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                                chartTimeRange === t ? "bg-slate-950 text-white border border-white/5" : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>

                        {/* Chart Tab Selector */}
                        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-850">
                          <button 
                            onClick={() => setActiveChartTab("admissions")}
                            className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                              activeChartTab === "admissions" ? "bg-slate-950 text-blue-400 border border-white/5" : "text-slate-500 hover:text-slate-350"
                            }`}
                          >
                            Funnel
                          </button>
                          <button 
                            onClick={() => setActiveChartTab("departments")}
                            className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                              activeChartTab === "departments" ? "bg-slate-950 text-purple-400 border border-white/5" : "text-slate-500 hover:text-slate-350"
                            }`}
                          >
                            Departments
                          </button>
                          <button 
                            onClick={() => setActiveChartTab("occupancy")}
                            className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                              activeChartTab === "occupancy" ? "bg-slate-950 text-emerald-400 border border-white/5" : "text-slate-500 hover:text-slate-350"
                            }`}
                          >
                            Hostel
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="h-56 w-full flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {activeChartTab === "admissions" && (
                          <motion.div 
                            key={`admissions-${chartTimeRange}`} 
                            initial={{ opacity: 0, y: 5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -5 }} 
                            className="w-full h-full flex flex-col justify-between pt-2 space-y-4"
                          >
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                                <span>Applications Submitted</span>
                                <span className="text-white font-mono">{chartTimeRange === "Week" ? "420" : chartTimeRange === "Month" ? "4.8K" : "28K"} candidates</span>
                              </div>
                              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 0.6 }}
                                  className="h-full bg-blue-500" 
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                                <span>Offers Dispatched</span>
                                <span className="text-white font-mono">{chartTimeRange === "Week" ? "105" : chartTimeRange === "Month" ? "1.2K" : "7.2K"} (25% rate)</span>
                              </div>
                              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: "25%" }}
                                  transition={{ duration: 0.6, delay: 0.1 }}
                                  className="h-full bg-purple-500" 
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                                <span>Registered & Enrolled</span>
                                <span className="text-white font-mono">{chartTimeRange === "Week" ? "71" : chartTimeRange === "Month" ? "820" : "4.9K"} (Yield rate)</span>
                              </div>
                              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: "17%" }}
                                  transition={{ duration: 0.6, delay: 0.2 }}
                                  className="h-full bg-emerald-500" 
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeChartTab === "departments" && (
                          <motion.div 
                            key={`departments-${chartTimeRange}`} 
                            initial={{ opacity: 0, scale: 0.98 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="w-full h-full flex items-center justify-around gap-4 pt-2"
                          >
                            <div className="text-center space-y-2">
                              <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex flex-col items-center justify-center font-bold text-xs text-white font-mono shadow-md animate-spin-slow">
                                <span>{chartTimeRange === "Week" ? "92%" : "94%"}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">CSE Utilization</p>
                            </div>
                            <div className="text-center space-y-2">
                              <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 flex flex-col items-center justify-center font-bold text-xs text-white font-mono shadow-md animate-spin-slow">
                                <span>{chartTimeRange === "Week" ? "85%" : "88%"}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">ECE Utilization</p>
                            </div>
                            <div className="text-center space-y-2">
                              <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 flex flex-col items-center justify-center font-bold text-xs text-white font-mono shadow-md animate-spin-slow">
                                <span>{chartTimeRange === "Week" ? "80%" : "82%"}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">ME Utilization</p>
                            </div>
                          </motion.div>
                        )}

                        {activeChartTab === "occupancy" && (
                          <motion.div 
                            key={`occupancy-${chartTimeRange}`} 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="w-full h-full flex flex-col justify-center space-y-4"
                          >
                            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-900 rounded-2xl hover:border-slate-800 transition">
                              <div className="space-y-1">
                                <p className="text-xs font-extrabold text-white leading-none">Hostel Occupancy Index</p>
                                <p className="text-[9px] text-slate-500 leading-none">Block A & B fully loaded</p>
                              </div>
                              <span className="text-xs font-bold text-emerald-400 font-mono">94.2% Occupied</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-900 rounded-2xl hover:border-slate-800 transition">
                              <div className="space-y-1">
                                <p className="text-xs font-extrabold text-white leading-none">Mess Feedback Ratings</p>
                                <p className="text-[9px] text-slate-500 leading-none">Weekly average score indices</p>
                              </div>
                              <span className="text-xs font-bold text-blue-400 font-mono">4.4 / 5.0 Rating</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Executive Approval Queue */}
                  <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-5 shadow-lg relative">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />
                    
                    <div className="border-b border-slate-900 pb-3 flex justify-between items-center">
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 select-none">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          <span>VC Executive Approval Queue</span>
                        </h3>
                        <p className="text-[9px] text-slate-500 mt-1 leading-none">Requires authorized VC/Dean digital credentials</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-bold font-mono text-slate-400">
                        {approvalsList.length} Dossiers
                      </span>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence>
                        {approvalsList.length === 0 ? (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 text-xs text-center py-4">All approval dossiers cleared.</motion.p>
                        ) : (
                          approvalsList.map(app => (
                            <motion.div 
                              key={app.id} 
                              layout
                              exit={{ opacity: 0, x: -10 }}
                              className="p-4 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-between flex-wrap gap-4 hover:border-slate-800 transition group/app relative"
                            >
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wide font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 leading-none">
                                    {app.type}
                                  </span>
                                  <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded leading-none ${
                                    app.priority === "High" ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-slate-900 border-slate-800 text-slate-500"
                                  }`}>
                                    {app.priority} Priority
                                  </span>
                                  <span className="text-[9px] text-slate-500 font-mono">Deadline: {app.deadline}</span>
                                </div>
                                <p className="text-xs font-bold text-white mt-1.5 truncate leading-none">{app.title}</p>
                                <p className="text-[9px] text-slate-500 mt-1 leading-none">{app.desc}</p>
                              </div>

                              {/* Hover Dossier Preview */}
                              <div className="absolute left-12 bottom-full mb-2 hidden group-hover/app:block p-3 rounded-xl border border-white/10 bg-slate-950 text-[10px] text-slate-300 w-64 shadow-2xl z-50">
                                <p className="font-bold text-white uppercase tracking-wider text-[8px] text-blue-400 mb-1">Dossier Impact</p>
                                <p>{app.impact}. Ready for baseline locking and system execution.</p>
                              </div>

                              <button 
                                onClick={() => handleApproveDossier(app.id, app.title)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-[10px] font-extrabold text-white cursor-pointer transition shrink-0"
                              >
                                Approve Dossier
                              </button>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                </div>

                {/* Right Columns (4 cols): AI Insight Panel, Live Feed */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* SECTION: AI Insight Panel */}
                  <div className="p-5 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-950 to-purple-950/10 backdrop-blur-xl space-y-4.5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
                    
                    <div className="flex justify-between items-center select-none">
                      <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                        <Sparkles size={14} className="text-purple-400" />
                        <span>AI Advisory Insight</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] font-extrabold text-purple-400 font-mono">
                        {aiInsight.confidence}% Confidence
                      </span>
                    </div>

                    <div className="space-y-3.5 text-xs text-slate-300 leading-normal">
                      <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-2xl space-y-1">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-400 font-mono">Recommendation</span>
                        <p className="font-bold text-white">{aiInsight.recommendation}</p>
                      </div>
                      
                      <div className="space-y-1 pl-1">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 font-mono">Reasoning Protocol</span>
                        <p className="text-[11px] text-slate-400">{aiInsight.reasoning}</p>
                      </div>

                      <div className="space-y-1 pl-1">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 font-mono">Expected Impact</span>
                        <p className="text-[11px] text-slate-400">{aiInsight.impact}</p>
                      </div>

                      <button 
                        onClick={() => triggerToast("Workload balanced successfully via copilot.")}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-[10px] font-extrabold text-white transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <Zap size={11} />
                        <span>{aiInsight.actionLabel}</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Command Feed */}
                  <div className="p-5 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-xl space-y-4 shadow-lg relative">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
                    
                    <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-widest select-none">
                      <Activity size={14} className="text-blue-400" />
                      <span>Live Command Feed</span>
                    </h3>
                    
                    <div className="relative pl-4 border-l border-slate-900 space-y-4 ml-1">
                      {liveFeed.map((feed, idx) => (
                        <div key={idx} className="relative text-xs leading-none">
                          {/* Ping indicators based on severity */}
                          <span className={`absolute -left-[20.5px] top-0.5 w-1.5 h-1.5 rounded-full ${
                            feed.severity === "Critical" ? "bg-red-500" :
                            feed.severity === "Warning" ? "bg-yellow-500" :
                            feed.severity === "Resolved" ? "bg-emerald-500" : "bg-blue-500"
                          } shrink-0`} />
                          <p className="font-semibold text-white leading-none">{feed.action}</p>
                          <p className="text-[9px] text-slate-500 leading-none mt-1.5">{feed.detail} • {feed.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

        </div>
      </main>

      {/* Persistent Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none font-sans">
        <AnimatePresence>
          {showAssistant && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-80 h-[400px] rounded-3xl border border-white/10 bg-slate-950 flex flex-col justify-between shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/5 bg-slate-900/40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shrink-0">
                    <Sparkles size={12} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white">SHIVIL AI Copilot</h4>
                    <p className="text-[8px] text-emerald-400 font-semibold tracking-wider uppercase">Active Context</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAssistant(false)}
                  className="text-slate-500 hover:text-white transition cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Chat Window */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-[11px] leading-relaxed">
                {assistantMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-3 rounded-2xl max-w-[85%] border ${
                      msg.role === 'user' 
                        ? 'bg-blue-600/10 border-blue-500/20 text-white rounded-br-none' 
                        : 'bg-slate-900/60 border-white/5 text-slate-350 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAssistantTyping && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-white/5 bg-slate-900/20 flex gap-2">
                <input 
                  type="text" 
                  value={assistantInput}
                  onChange={e => setAssistantInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendAssistantMessage()}
                  placeholder="Ask copilot command..."
                  className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-blue-500/50"
                />
                <button 
                  onClick={handleSendAssistantMessage}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shrink-0 transition cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Bubble Trigger */}
        <button
          onClick={() => setShowAssistant(prev => !prev)}
          className="p-3.5 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-blue-500/20 hover:scale-105 transition cursor-pointer relative"
        >
          <Bot size={20} />
          {!showAssistant && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-slate-950 animate-ping" />
          )}
        </button>
      </div>

      {/* Advanced Notification Center Drawer (Right Side Drawer) */}
      <AnimatePresence>
        {showNotificationCenter && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotificationCenter(false)}
              className="fixed inset-0 bg-slate-950 z-40"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-slate-950 border-l border-white/5 shadow-2xl z-50 p-6 flex flex-col justify-between font-sans text-xs select-none"
            >
              <div className="space-y-6 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-blue-400" />
                    <span className="font-extrabold text-white uppercase tracking-wider text-[11px]">System Logs Center</span>
                  </div>
                  <button 
                    onClick={() => setShowNotificationCenter(false)}
                    className="text-slate-500 hover:text-white transition cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Tabs selection */}
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-850">
                  {["Critical", "Warning", "Info", "Resolved"].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveNotificationTab(tab as any)}
                      className={`flex-1 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        activeNotificationTab === tab 
                          ? tab === 'Critical' ? "bg-red-500/10 border border-red-500/20 text-red-400" :
                            tab === 'Warning' ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400" :
                            tab === 'Resolved' ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                          : "text-slate-500 hover:text-slate-350"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Notifications Tab Content list */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                  {notificationsList.filter(n => n.cat === activeNotificationTab).length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No notifications in this folder.</p>
                  ) : (
                    notificationsList.filter(n => n.cat === activeNotificationTab).map(not => (
                      <div key={not.id} className="p-3.5 bg-slate-900/30 border border-white/5 rounded-2xl space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-bold">
                          <span className={`${
                            not.cat === 'Critical' ? "text-red-400" :
                            not.cat === 'Warning' ? "text-yellow-400" :
                            not.cat === 'Resolved' ? "text-emerald-400" : "text-blue-400"
                          }`}>{not.cat}</span>
                          <span className="text-slate-500 font-mono">{not.time}</span>
                        </div>
                        <p className="font-bold text-white text-[11px] leading-tight">{not.title}</p>
                        <p className="text-[10px] text-slate-500 leading-normal">{not.desc}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowNotificationCenter(false);
                  triggerToast("All alerts logs marked as read.");
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-extrabold text-slate-300 hover:text-white transition mt-6"
              >
                Mark all as read
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Universal Command Palette Modal Dialog (Ctrl+K) */}
      <AnimatePresence>
        {showCommandMenu && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCommandMenu(false)}
              className="fixed inset-0 bg-slate-950 z-50 backdrop-blur-sm"
            />
            
            {/* Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-slate-950 border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] z-50 overflow-hidden font-sans select-none"
            >
              {/* Search input header */}
              <div className="p-4 border-b border-white/5 bg-slate-900/20 flex items-center gap-3">
                <Search size={16} className="text-slate-500" />
                <input 
                  type="text" 
                  value={commandSearch}
                  onChange={e => setCommandSearch(e.target.value)}
                  placeholder="Type a query or AI command (e.g. risk)..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"
                  autoFocus
                />
                <button 
                  onClick={() => setShowCommandMenu(false)}
                  className="text-[10px] font-bold text-slate-500 hover:text-white transition px-2 py-1 rounded bg-slate-900 border border-slate-800"
                >
                  ESC
                </button>
              </div>

              {/* Command options list */}
              <div className="p-3 max-h-[300px] overflow-y-auto text-xs space-y-1">
                <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 px-3 py-1 font-mono">Suggested AI actions</p>
                
                <button 
                  onClick={() => handleCommandExecute("dropout")}
                  className="w-full text-left p-3 hover:bg-slate-900/60 rounded-2xl flex justify-between items-center group transition cursor-pointer text-[11px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={14} className="text-purple-400" />
                    <span className="font-bold text-white">dropout --cse</span>
                    <span className="text-slate-500">• Predict student dropout risk indices</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 group-hover:text-white font-mono">ENTER</span>
                </button>

                <button 
                  onClick={() => handleCommandExecute("audit")}
                  className="w-full text-left p-3 hover:bg-slate-900/60 rounded-2xl flex justify-between items-center group transition cursor-pointer text-[11px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Activity size={14} className="text-blue-400" />
                    <span className="font-bold text-white">audit --attendance</span>
                    <span className="text-slate-500">• Verify check-in records signatures</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 group-hover:text-white font-mono">ENTER</span>
                </button>

                <button 
                  onClick={() => handleCommandExecute("notice")}
                  className="w-full text-left p-3 hover:bg-slate-900/60 rounded-2xl flex justify-between items-center group transition cursor-pointer text-[11px]"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText size={14} className="text-pink-400" />
                    <span className="font-bold text-white">dispatch --notices</span>
                    <span className="text-slate-500">• Trigger warning emails parent dispatch</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 group-hover:text-white font-mono">ENTER</span>
                </button>

                <button 
                  onClick={() => handleCommandExecute("theme")}
                  className="w-full text-left p-3 hover:bg-slate-900/60 rounded-2xl flex justify-between items-center group transition cursor-pointer text-[11px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings size={14} className="text-slate-400" />
                    <span className="font-bold text-white">resync --themes</span>
                    <span className="text-slate-500">• Sync color matrices system theme</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 group-hover:text-white font-mono">ENTER</span>
                </button>
              </div>

              {/* Footer shortcuts info */}
              <div className="p-3 bg-slate-900/40 border-t border-white/5 flex gap-4 text-[9px] text-slate-500 font-semibold select-none font-mono">
                <span>↑↓ navigate</span>
                <span>⏎ select</span>
                <span>esc close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Dashboard;
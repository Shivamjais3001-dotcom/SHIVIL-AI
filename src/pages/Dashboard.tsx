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
  Settings,
  Plus,
  Percent,
  CheckSquare,
  ClipboardCheck,
  FileSpreadsheet,
  HelpCircle,
  UserCheck,
  Check
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
  
  // Dynamic Sync and Uptime states
  const [lastSyncSec, setLastSyncSec] = useState(0);
  const [systemUptimeSec, setSystemUptimeSec] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Authenticated Role credentials
  const activeRole = localStorage.getItem("userRole") || "Admin";
  const activeName = localStorage.getItem("adminName") || "Shivam Jaiswal";

  // Dynamic Dashboard Sub-View State
  const [activeSubView, setActiveSubView] = useState(() => {
    if (activeRole === "Student") return "Student Portal";
    if (activeRole === "Faculty") return "Faculty Portal";
    return "VC Command Center"; // Admin default
  });

  // AI Assistant Chat state
  const [assistantInput, setAssistantInput] = useState("");
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<Array<{ role: "user" | "assistant", text: string }>>([]);

  // Initialize role-specific chat greeting
  useEffect(() => {
    let greeting = "";
    if (activeSubView === "Student Portal") {
      greeting = "Hello Student! I am your AI Study Copilot. You can ask me to draft study planners, generate summary notes, or explain complex doubts.";
    } else if (activeSubView === "Faculty Portal") {
      greeting = "Greetings Faculty. I am your Grading & Syllabus Copilot. Ask me to generate question papers, list weak students, or draft class announcements.";
    } else if (activeSubView === "HOD Advisor") {
      greeting = "HOD Console active. I am your Accreditation & Load Advisor. Ask me to balance faculty workloads or list accreditation gaps.";
    } else if (activeSubView === "Finance Hub") {
      greeting = "Financial Systems Linked. Ask me to forecast next month's fee collections, check outstanding balances, or calculate yield trends.";
    } else if (activeSubView === "Placement Suite") {
      greeting = "Placement Tracker active. Ask me which students are eligible for Microsoft drives, check average salaries, or analyze resumes.";
    } else {
      greeting = "VC Executive Copilot active. Ask me about university health curves, dropout indexes, or budget updates.";
    }
    setAssistantMessages([{ role: "assistant", text: greeting }]);
  }, [activeSubView]);

  // Loading skeleton simulation
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeSubView]);

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

  // Executive summary metrics
  const healthScore = 98.6;
  const riskIndex = "2.4%";
  const budgetCollected = "$1.24M";
  const budgetGoal = "$1.50M";
  const placementRate = "94.2%";

  // Mock data definitions for HOD, Finance, and Placement sections
  const HODData = {
    facultyIndex: "92% Rating",
    placementYield: "94.2%",
    reserves: "$185K",
    accreditationScore: "98.6%",
    accreditationTasks: [
      { name: "Syllabus Compliance Audits", status: "Done" },
      { name: "Faculty Credentials Verification", status: "Pending" },
      { name: "Laboratory Safety Clearances", status: "Done" }
    ],
    facultyLoads: [
      { name: "Dr. Sarah Jenkins", load: "20 hrs", status: "Overloaded" },
      { name: "Prof. Marcus Vance", load: "12 hrs", status: "Underloaded" },
      { name: "Dr. Anya Sen", load: "16 hrs", status: "Optimal" }
    ]
  };

  const FinanceData = {
    revenue: "$1.24M",
    outstanding: "$260K",
    payroll: "$480K / mo",
    yieldRate: "82% yield",
    unpaidList: [
      { student: "Neha Reddy", dues: "$1,499", status: "Overdue" },
      { student: "Rohan Das", dues: "$750", status: "Overdue" }
    ]
  };

  const PlacementData = {
    averagePackage: "$12.4 LPA",
    highestPackage: "$45 LPA",
    eligibleCount: 480,
    placedRatio: "84.5%",
    upcomingDrives: [
      { company: "Microsoft India", date: "July 22, 10:00", type: "Full Time" },
      { company: "Google Core AI", date: "July 26, 09:30", type: "Internship" }
    ],
    readinessList: [
      { name: "Neha Reddy", cgpa: "8.85", codeScore: "92%", status: "Eligible" },
      { name: "Anya Sen", cgpa: "9.20", codeScore: "96%", status: "Eligible" }
    ]
  };

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
      
      if (activeSubView === "Student Portal") {
        if (userMsg.toLowerCase().includes("study") || userMsg.toLowerCase().includes("plan")) {
          replyText += "Based on your syllabus, you should allocate 2 hours to CS-302 (Algorithms, Tree Traversals) and 1 hour to AI-310 (Neural Network backpropagation) today.";
        } else if (userMsg.toLowerCase().includes("doubt") || userMsg.toLowerCase().includes("complexity")) {
          replyText += "Big-O complexity represents the upper bound of run time. For example, binary search operates in O(log n) logarithmic complexity by splitting arrays in halves.";
        } else {
          replyText += "Your doubt has been mapped to current course modules. Generating summary notes file...";
        }
      } else if (activeSubView === "Faculty Portal") {
        if (userMsg.toLowerCase().includes("weak") || userMsg.toLowerCase().includes("student")) {
          replyText += "I detected 1 student (Neha Reddy) with attendance at 58% in CS-302. I suggest emailing a warning notice.";
        } else if (userMsg.toLowerCase().includes("question") || userMsg.toLowerCase().includes("paper")) {
          replyText += "Generated 5 sample questions for CS-302 Algorithms Midterm: 1. Explain Dijkstra's shortest path. 2. Verify Prim's complexity bounds. 3. Contrast BFS and DFS trees.";
        } else {
          replyText += "Recommendation drafted successfully for class roster.";
        }
      } else if (activeSubView === "HOD Advisor") {
        if (userMsg.toLowerCase().includes("load") || userMsg.toLowerCase().includes("balance")) {
          replyText += "Dr. Sarah Jenkins is carrying 20 hours (overloaded). Reallocating the Algorithms Lab (4 hours) to Prof. Marcus Vance balances loads to optimal 16-hour limits.";
        } else {
          replyText += "Accreditation review active. Syllabus indices are fully updated.";
        }
      } else if (activeSubView === "Finance Hub") {
        if (userMsg.toLowerCase().includes("predict") || userMsg.toLowerCase().includes("collection")) {
          replyText += "Predicted Q3 collection yield is 94.5% ($1.42M) by month end, assuming outstanding mess dues ($260K) are processed.";
        } else {
          replyText += "Revenue prediction metrics mapped to finance charts.";
        }
      } else if (activeSubView === "Placement Suite") {
        if (userMsg.toLowerCase().includes("microsoft") || userMsg.toLowerCase().includes("eligible")) {
          replyText += "2 students meet Microsoft eligibility parameters (Neha Reddy, Anya Sen). Both carry CGPA > 8.5 and coding scores > 90%.";
        } else {
          replyText += "Mock interview session guidelines sent to roster.";
        }
      } else {
        replyText += "Inference compiled. Commands executed.";
      }
      
      setAssistantMessages(prev => [...prev, { role: "assistant", text: replyText }]);
    }, 1200);
  };

  const handleCommandExecute = (actionName: string) => {
    setShowCommandMenu(false);
    setCommandSearch("");
    if (actionName === "dropout") {
      setShowAssistant(true);
      setAssistantInput("Analyze dropout risks");
      setTimeout(() => handleSendAssistantMessage(), 100);
    } else {
      triggerToast(`Command executed: ${actionName}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#030712] font-sans overflow-x-hidden selection:bg-blue-500/20 text-slate-100 relative">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0 z-10 relative">
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

          {/* DYNAMIC EXECUTIVE HEADER WITH ROLE SWITCHER */}
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
                  className="hover:text-blue-400 transition cursor-pointer flex items-center gap-1 font-bold text-[9px]"
                >
                  <span>Synced {lastSyncSec}s ago</span>
                </button>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1.5 flex items-center gap-2.5">
                  <Sliders className="text-blue-500" size={24} />
                  <span>{activeSubView}</span>
                </h1>

                {/* Switcher Dropdown (Only visible for Admins) */}
                {activeRole === "Admin" && (
                  <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-850 mt-1">
                    {[
                      { id: "VC Command Center", label: "VC Center" },
                      { id: "HOD Advisor", label: "HOD" },
                      { id: "Finance Hub", label: "Finance" },
                      { id: "Placement Suite", label: "Placement" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSubView(tab.id)}
                        className={`px-3 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-wider transition cursor-pointer ${
                          activeSubView === tab.id ? "bg-slate-950 text-blue-400 border border-white/5" : "text-slate-500 hover:text-slate-350"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-slate-400 text-xs mt-1">
                Authorized identity: {activeName} ({activeRole}).
              </p>
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
                <span>Role Copilot Active</span>
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
              {/* ────────────────────────────────────────────────────────
                  SUB-VIEW 1: STUDENT PORTAL 
                  ──────────────────────────────────────────────────────── */}
              {activeSubView === "Student Portal" && (
                <div className="space-y-8">
                  {/* KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Attendance Progress</span>
                        <Activity size={14} className="text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">94.2%</h3>
                      <p className="text-[9px] text-emerald-400 font-bold">Prediction: Safe Baseline</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>CGPA Forecast</span>
                        <Award size={14} className="text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">8.85 / 10</h3>
                      <p className="text-[9px] text-blue-400 font-bold">Predicted Honors Track</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Pending Tasks</span>
                        <FileText size={14} className="text-pink-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">2 Assignments</h3>
                      <p className="text-[9px] text-slate-500 font-mono">Deadline: July 20</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Scholarship Credit</span>
                        <DollarSign size={14} className="text-yellow-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">$4,500</h3>
                      <p className="text-[9px] text-emerald-400 font-bold">Fully Disbursed</p>
                    </div>
                  </div>

                  {/* Main split */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Schedule & Midterm Chart */}
                    <div className="lg:col-span-8 space-y-8">
                      <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <Clock size={14} className="text-blue-500" />
                          <span>Today's Academic Calendar</span>
                        </h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex justify-between items-center">
                            <div>
                              <p className="font-bold text-white text-xs">Algorithms Lecture (CS-302)</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Dr. Sarah Jenkins • Room 102</p>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono">09:00 - 10:30</span>
                          </div>
                          <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex justify-between items-center">
                            <div>
                              <p className="font-bold text-white text-xs">Neural Networks Lab (AI-310)</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">Prof. Marcus Vance • Lab Room B</p>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-mono">11:00 - 12:30</span>
                          </div>
                        </div>
                      </div>

                      {/* Performance Plot chart */}
                      <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <BarChart3 size={14} className="text-blue-500" />
                          <span>Midterm Score Distributions</span>
                        </h3>
                        <div className="h-40 w-full flex items-end gap-3 pt-4">
                          <div className="flex-1 bg-slate-900 h-24 rounded-lg relative"><div className="absolute bottom-0 inset-x-0 bg-blue-500 h-16 rounded-lg text-[9px] font-bold text-center pt-2">82%</div></div>
                          <div className="flex-1 bg-slate-900 h-32 rounded-lg relative"><div className="absolute bottom-0 inset-x-0 bg-blue-500 h-28 rounded-lg text-[9px] font-bold text-center pt-2">92%</div></div>
                          <div className="flex-1 bg-slate-900 h-20 rounded-lg relative"><div className="absolute bottom-0 inset-x-0 bg-blue-500 h-12 rounded-lg text-[9px] font-bold text-center pt-2">74%</div></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-bold font-mono">
                          <span className="flex-1 text-center">Algorithms</span>
                          <span className="flex-1 text-center">Neural Nets</span>
                          <span className="flex-1 text-center">Cloud Computing</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Study Assistant */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="p-5 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-950 to-purple-950/10 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                          <Sparkles size={14} className="text-purple-400" />
                          <span>AI Study Copilot</span>
                        </h3>
                        <div className="space-y-2">
                          <button 
                            onClick={() => { setAssistantInput("Help me study Big-O complexity"); }}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] font-bold text-purple-400 hover:text-white transition"
                          >
                            💡 Explain Big-O complexity
                          </button>
                          <button 
                            onClick={() => { setAssistantInput("Draft a study plan for midterms"); }}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] font-bold text-purple-400 hover:text-white transition"
                          >
                            📅 Draft midterm study plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions bottom */}
                  <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 space-y-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Portal Quick Actions</p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => triggerToast("Admit Card PDF compiled successfully.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Download Admit Card</button>
                      <button onClick={() => triggerToast("Redirecting to secured payment gateway...")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Pay Term Fees</button>
                      <button onClick={() => triggerToast("Leave request dossier logged for review.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Request Leave</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                  SUB-VIEW 2: FACULTY PORTAL 
                  ──────────────────────────────────────────────────────── */}
              {activeSubView === "Faculty Portal" && (
                <div className="space-y-8">
                  {/* KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Teaching Workload</span>
                        <Clock size={14} className="text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">14 hrs / wk</h3>
                      <p className="text-[9px] text-emerald-400 font-bold">Limit: 16 hrs (Optimal)</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Avg Attendance</span>
                        <Activity size={14} className="text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">92.4%</h3>
                      <p className="text-[9px] text-slate-500 font-mono">CS-302 Algorithms Section B</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Syllabus Progress</span>
                        <Layers size={14} className="text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">78% Done</h3>
                      <p className="text-[9px] text-emerald-400 font-bold">Ahead of baseline guidelines</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Active Grants</span>
                        <Award size={14} className="text-pink-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">2 Projects</h3>
                      <p className="text-[9px] text-purple-400 font-bold">Funding: $45K reserves</p>
                    </div>
                  </div>

                  {/* Main Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Classes and Class Heatmap */}
                    <div className="lg:col-span-8 space-y-8">
                      <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <Activity size={14} className="text-emerald-400" />
                          <span>Student Engagement Heatmap</span>
                        </h3>
                        <div className="grid grid-cols-5 gap-3 p-4 bg-slate-950 border border-slate-900 rounded-2xl max-w-sm mx-auto">
                          {[...Array(25)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-6 h-6 rounded-md ${
                                i % 5 === 0 ? "bg-emerald-500" :
                                i % 3 === 0 ? "bg-emerald-600/60" :
                                i % 2 === 0 ? "bg-emerald-700/30" : "bg-slate-900"
                              } hover:scale-110 transition-transform`} 
                            />
                          ))}
                        </div>
                      </div>

                      {/* Weak Students list red alerts */}
                      <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <AlertTriangle size={14} className="text-red-400" />
                          <span>Critical Student Interventions Required</span>
                        </h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-white">Neha Reddy (CS-302 Algorithms)</p>
                              <p className="text-[10px] text-slate-500 mt-1">Attendance: 58%. Midterm grading deviation: -12%.</p>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[8px] font-extrabold text-red-400 uppercase">Attention</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Faculty copilot */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="p-5 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-950 to-purple-950/10 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                          <Sparkles size={14} className="text-purple-400" />
                          <span>Faculty AI Copilot</span>
                        </h3>
                        <div className="space-y-2">
                          <button 
                            onClick={() => { setAssistantInput("Draft Algorithms exam questions"); }}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] font-bold text-purple-400 hover:text-white transition"
                          >
                            📝 Generate Question Paper
                          </button>
                          <button 
                            onClick={() => { setAssistantInput("Show weak students in CS-302"); }}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] font-bold text-purple-400 hover:text-white transition"
                          >
                            🔍 Search weak student alerts
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 space-y-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Workspace Quick Actions</p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => triggerToast("New assignment created successfully.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Create Assignment</button>
                      <button onClick={() => triggerToast("Marks dossier uploaded to registrar.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Upload Marks Dossier</button>
                      <button onClick={() => triggerToast("Announcements circular dispatched.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Send Notice</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                  SUB-VIEW 3: HOD DASHBOARD
                  ──────────────────────────────────────────────────────── */}
              {activeSubView === "HOD Advisor" && (
                <div className="space-y-8">
                  {/* KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Faculty Index</span>
                        <Users size={14} className="text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">{HODData.facultyIndex}</h3>
                      <p className="text-[9px] text-emerald-400 font-bold">Excellent feedback average</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Placement Yield</span>
                        <Briefcase size={14} className="text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">{HODData.placementYield}</h3>
                      <p className="text-[9px] text-emerald-400 font-bold">Ranked #1 on campus</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Research Funding</span>
                        <DollarSign size={14} className="text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">{HODData.reserves}</h3>
                      <p className="text-[9px] text-slate-500">Q3 allocations</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Accreditation Gaps</span>
                        <CheckSquare size={14} className="text-pink-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-pink-400 font-mono">{HODData.accreditationScore}</h3>
                      <p className="text-[9px] text-slate-500 font-mono">1 pending dossier verification</p>
                    </div>
                  </div>

                  {/* Layout split */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Load balancing & checklist */}
                    <div className="lg:col-span-8 space-y-8">
                      <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <Sliders size={14} className="text-blue-500" />
                          <span>Accreditation Audit Trackers</span>
                        </h3>
                        <div className="space-y-2">
                          {HODData.accreditationTasks.map((t, i) => (
                            <div key={i} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex justify-between items-center">
                              <p className="text-xs font-bold text-white">{t.name}</p>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                t.status === "Done" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
                              }`}>{t.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Overload optimizer */}
                      <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <Users size={14} className="text-blue-500" />
                          <span>Instructor Workload Optimizer</span>
                        </h3>
                        <div className="space-y-2">
                          {HODData.facultyLoads.map((f, i) => (
                            <div key={i} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex justify-between items-center">
                              <div>
                                <p className="text-xs font-bold text-white">{f.name}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">Assigned teaching hours: {f.load}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                                f.status === "Overloaded" ? "bg-red-500/10 border border-red-500/20 text-red-400" :
                                f.status === "Underloaded" ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400" : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                              }`}>{f.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Advisor panel */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="p-5 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-950 to-purple-950/10 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                          <Sparkles size={14} className="text-purple-400" />
                          <span>HOD AI Advisor</span>
                        </h3>
                        <div className="space-y-2">
                          <button 
                            onClick={() => { setAssistantInput("Suggest workload balancing options"); }}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] font-bold text-purple-400 hover:text-white transition"
                          >
                            ⚖️ Optimize Faculty teaching loads
                          </button>
                          <button 
                            onClick={() => { setAssistantInput("Show accreditation gaps"); }}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] font-bold text-purple-400 hover:text-white transition"
                          >
                            📋 Check accreditation gaps
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 space-y-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Administration Actions</p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => triggerToast("Faculty workload balanced successfully.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Balance Load Matrix</button>
                      <button onClick={() => triggerToast("Accreditation dossier locked and synchronized.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Sync Accreditation Dossier</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                  SUB-VIEW 4: FINANCE HUB
                  ──────────────────────────────────────────────────────── */}
              {activeSubView === "Finance Hub" && (
                <div className="space-y-8">
                  {/* KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Revenue Collected</span>
                        <DollarSign size={14} className="text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">{FinanceData.revenue}</h3>
                      <p className="text-[9px] text-slate-500">Q3 Target: $1.50M</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Outstanding Balances</span>
                        <AlertCircle size={14} className="text-red-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-red-400 font-mono">{FinanceData.outstanding}</h3>
                      <p className="text-[9px] text-slate-500 font-mono">Dues warning dispatches active</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Monthly Payroll</span>
                        <CreditCard size={14} className="text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">{FinanceData.payroll}</h3>
                      <p className="text-[9px] text-slate-500">Salary payouts scheduled</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Collection Yield</span>
                        <TrendingUp size={14} className="text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-emerald-400 font-mono">{FinanceData.yieldRate}</h3>
                      <p className="text-[9px] text-slate-500">Yield target matched</p>
                    </div>
                  </div>

                  {/* Main Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Financial Ledger chart */}
                    <div className="lg:col-span-8 space-y-8">
                      <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <BarChart3 size={14} className="text-blue-500" />
                          <span>Fee Collections Ledger Flow</span>
                        </h3>
                        <div className="h-44 w-full flex items-end gap-6 pt-4">
                          <div className="flex-1 bg-slate-900 h-28 rounded-xl relative"><div className="absolute bottom-0 inset-x-0 bg-emerald-500 h-24 rounded-xl text-[9px] font-bold text-center pt-2">Q1</div></div>
                          <div className="flex-1 bg-slate-900 h-36 rounded-xl relative"><div className="absolute bottom-0 inset-x-0 bg-emerald-500 h-32 rounded-xl text-[9px] font-bold text-center pt-2">Q2</div></div>
                          <div className="flex-1 bg-slate-900 h-24 rounded-xl relative"><div className="absolute bottom-0 inset-x-0 bg-blue-500 h-16 rounded-xl text-[9px] font-bold text-center pt-2">Q3 (Live)</div></div>
                        </div>
                      </div>

                      {/* Outstanding dues list */}
                      <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <AlertTriangle size={14} className="text-yellow-400" />
                          <span>Outstanding Fee Balances by Student</span>
                        </h3>
                        <div className="space-y-2">
                          {FinanceData.unpaidList.map((st, i) => (
                            <div key={i} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex justify-between items-center">
                              <div>
                                <p className="text-xs font-bold text-white">{st.student}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">Dues amount: {st.dues}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[8px] font-extrabold text-red-400 uppercase">{st.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Finance copilot */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="p-5 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-950 to-purple-950/10 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                          <Sparkles size={14} className="text-purple-400" />
                          <span>Finance AI Assistant</span>
                        </h3>
                        <div className="space-y-2">
                          <button 
                            onClick={() => { setAssistantInput("Predict next month's fee collection"); }}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] font-bold text-purple-400 hover:text-white transition"
                          >
                            📈 Predict Q3 collections yield
                          </button>
                          <button 
                            onClick={() => { setAssistantInput("Analyze outstanding fee risk metrics"); }}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] font-bold text-purple-400 hover:text-white transition"
                          >
                            ⚠️ Scan outstanding balance risk
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 space-y-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Financial Operations</p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => triggerToast("Financial report spreadsheet exported successfully.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Export Audit Sheets</button>
                      <button onClick={() => triggerToast("Monthly salary dispatches scheduled successfully.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Process Payroll Dispatch</button>
                      <button onClick={() => triggerToast("Dues warning notices dispatched to outstanding roster.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Send Dues Reminders</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                  SUB-VIEW 5: PLACEMENT SUITE
                  ──────────────────────────────────────────────────────── */}
              {activeSubView === "Placement Suite" && (
                <div className="space-y-8">
                  {/* KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Average Package</span>
                        <Briefcase size={14} className="text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">{PlacementData.averagePackage}</h3>
                      <p className="text-[9px] text-emerald-400 font-bold">+18% over last batch</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Highest Offer</span>
                        <Award size={14} className="text-yellow-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-yellow-400 font-mono">{PlacementData.highestPackage}</h3>
                      <p className="text-[9px] text-slate-500">Sourced from Core AI research</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Eligible Candidates</span>
                        <Users size={14} className="text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-white font-mono">{PlacementData.eligibleCount} Students</h3>
                      <p className="text-[9px] text-slate-500">Roster matches drive criteria</p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 h-32 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>Placed Yield</span>
                        <TrendingUp size={14} className="text-emerald-400" />
                      </div>
                      <h3 className="text-2xl font-extrabold text-emerald-400 font-mono">{PlacementData.placedRatio}</h3>
                      <p className="text-[9px] text-slate-500 font-mono">Stable recruiting funnel</p>
                    </div>
                  </div>

                  {/* Split layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Recruiters list & drive checklist */}
                    <div className="lg:col-span-8 space-y-8">
                      <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <Calendar size={14} className="text-blue-500" />
                          <span>Recruitment Drive Timelines</span>
                        </h3>
                        <div className="space-y-2">
                          {PlacementData.upcomingDrives.map((d, i) => (
                            <div key={i} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex justify-between items-center">
                              <div>
                                <p className="text-xs font-bold text-white">{d.company}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">Role Type: {d.type}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-mono">{d.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Eligibility checklist */}
                      <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                          <CheckSquare size={14} className="text-blue-500" />
                          <span>Microsoft drive candidate eligibilities</span>
                        </h3>
                        <div className="space-y-2">
                          {PlacementData.readinessList.map((st, i) => (
                            <div key={i} className="p-4 bg-slate-950 border border-slate-900 rounded-2xl flex justify-between items-center">
                              <div>
                                <p className="text-xs font-bold text-white">{st.name}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">CGPA: {st.cgpa} • Coding Score: {st.codeScore}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-extrabold text-emerald-400 uppercase">{st.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: AI Placement optimizer */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="p-5 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-950 to-purple-950/10 space-y-4 shadow-lg">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                          <Sparkles size={14} className="text-purple-400" />
                          <span>AI Resume & Coach Assistant</span>
                        </h3>
                        <div className="space-y-2">
                          <button 
                            onClick={() => { setAssistantInput("Which students are ready for Microsoft drives?"); }}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] font-bold text-purple-400 hover:text-white transition"
                          >
                            💼 Scan candidates for Microsoft drive
                          </button>
                          <button 
                            onClick={() => { setAssistantInput("Analyze placements readiness scores"); }}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-[10px] font-bold text-purple-400 hover:text-white transition"
                          >
                            🔍 Compile placements suitability metrics
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/40 space-y-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Placement Coordination</p>
                    <div className="flex flex-wrap gap-4">
                      <button onClick={() => triggerToast("Eligibility notifications dispatched to matching candidate rosters.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Send Eligibility Notices</button>
                      <button onClick={() => triggerToast("Current placement drive report exported successfully.")} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition">Export Roster Sheets</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────
                  SUB-VIEW 6: VC / DEAN COMMAND CENTER (DEFAULT ADMIN)
                  ──────────────────────────────────────────────────────── */}
              {activeSubView === "VC Command Center" && (
                <div className="space-y-8">
                  {/* KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Health Score */}
                    <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl group hover:border-slate-800 transition shadow flex flex-col justify-between h-36">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Health Index</span>
                        <Heart size={14} className="text-red-400 animate-pulse" />
                      </div>
                      <div className="my-1">
                        <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">{healthScore}%</h3>
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
                        <h3 className="text-2xl font-extrabold text-purple-400 mt-1 font-mono">{riskIndex}</h3>
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
                        <h3 className="text-2xl font-extrabold text-white mt-1 font-mono">{budgetCollected}</h3>
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
                        <h3 className="text-2xl font-extrabold text-blue-400 mt-1 font-mono">{placementRate}</h3>
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

                  {/* Command Split panels */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Admissions charts, VC Approvals */}
                    <div className="lg:col-span-8 space-y-8">
                      <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-6 shadow-lg relative">
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" />
                        
                        <div className="flex items-center justify-between border-b border-slate-900 pb-4 flex-wrap gap-4 select-none">
                          <div className="space-y-1">
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                              <BarChart3 size={14} className="text-blue-500" />
                              <span>Real-time Command Analytics</span>
                            </h3>
                            <p className="text-[9px] text-slate-500 font-semibold font-mono">Interactive index mapping</p>
                          </div>

                          <div className="flex items-center gap-3">
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
                                  <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider font-mono">CSE Utilization</p>
                                </div>
                                <div className="text-center space-y-2">
                                  <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 border-t-blue-500 flex flex-col items-center justify-center font-bold text-xs text-white font-mono shadow-md animate-spin-slow">
                                    <span>{chartTimeRange === "Week" ? "85%" : "88%"}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider font-mono">ECE Utilization</p>
                                </div>
                                <div className="text-center space-y-2">
                                  <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 flex flex-col items-center justify-center font-bold text-xs text-white font-mono shadow-md animate-spin-slow">
                                    <span>{chartTimeRange === "Week" ? "80%" : "82%"}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider font-mono">ME Utilization</p>
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
                    </div>

                    {/* Right: VC advisory suggestions & feed */}
                    <div className="lg:col-span-4 space-y-8">
                      <div className="p-5 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-slate-950 to-purple-950/10 backdrop-blur-xl space-y-4 shadow-lg relative">
                        <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider select-none">
                          <Sparkles size={14} className="text-purple-400 animate-pulse" />
                          <span>AI Advisory Suggestions</span>
                        </h3>
                        <div className="space-y-3.5 text-xs text-slate-350 font-semibold leading-relaxed">
                          <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-2xl space-y-1">
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-purple-400 font-mono">Advisory Suggestion</span>
                            <p className="font-bold text-white">Reallocate CS-302 Algorithms Lab</p>
                          </div>
                          <p className="text-[11px] text-slate-400">Dr Jenkins is overloaded. Balance load limits dynamically.</p>
                          <button 
                            onClick={() => triggerToast("Workload balanced successfully via copilot.")}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-[10px] font-extrabold text-white transition flex items-center justify-center gap-1.5 shadow"
                          >
                            <Zap size={11} />
                            <span>Optimize Faculty Load</span>
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
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
                        <div className="flex justify-between items-center text-[9px] font-bold font-mono">
                          <span className={`${
                            not.cat === 'Critical' ? "text-red-400" :
                            not.cat === 'Warning' ? "text-yellow-400" :
                            not.cat === 'Resolved' ? "text-emerald-400" : "text-blue-400"
                          }`}>{not.cat}</span>
                          <span className="text-slate-500">{not.time}</span>
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
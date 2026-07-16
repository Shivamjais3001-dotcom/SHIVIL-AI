import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { 
  CalendarDays, 
  Sparkles, 
  ShieldAlert, 
  Mail, 
  ArrowRight, 
  Filter, 
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Search,
  CheckCircle2,
  X,
  AlertTriangle,
  Send,
  Activity,
  Users,
  Building
} from "lucide-react";
import type { Student } from "../types/student";
import { studentService } from "../services/studentService";

function Attendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filterBranch, setFilterBranch] = useState("All");
  const [showShortagesOnly, setShowShortagesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [selectedStudentForLetter, setSelectedStudentForLetter] = useState<any | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<"monthly" | "subjects" | "departments">("monthly");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentService.getAll();
        setStudents(data);
      } catch (err) {
        console.error("Attendance students fetch failed", err);
      }
    };
    fetchStudents();
  }, []);

  // Map students to detailed mock attendance values
  const studentAttendanceList = useMemo(() => {
    return students.map((s) => {
      let rate = 92;
      let totalClasses = 60;
      let present = 55;

      if (s.name === "Neha Reddy") {
        rate = 58;
        present = 35;
      } else if (s.name === "Anya Sen") {
        rate = 64;
        present = 38;
      } else if (s.name === "Rohan Gupta") {
        rate = 74;
        present = 44;
      } else if (s.name === "Priya Patel") {
        rate = 88;
        present = 53;
      } else if (s.name === "Kabir Singh") {
        rate = 95;
        present = 57;
      }

      return {
        ...s,
        attendanceRate: rate,
        totalClasses,
        presentClasses: present,
        absentClasses: totalClasses - present,
        isAtRisk: rate < 75,
        eligibility: rate >= 75 ? "Eligible" : "Blocked"
      };
    });
  }, [students]);

  // Filters application
  const filteredLogs = useMemo(() => {
    return studentAttendanceList.filter((log) => {
      const matchSearch = log.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.roll.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBranch = filterBranch === "All" || log.branch === filterBranch;
      const matchShortage = !showShortagesOnly || log.attendanceRate < 75;

      return matchSearch && matchBranch && matchShortage;
    });
  }, [studentAttendanceList, searchQuery, filterBranch, showShortagesOnly]);

  const averageAttendance = useMemo(() => {
    if (studentAttendanceList.length === 0) return 0;
    const total = studentAttendanceList.reduce((acc, curr) => acc + curr.attendanceRate, 0);
    return (total / studentAttendanceList.length).toFixed(1);
  }, [studentAttendanceList]);

  const shortageCount = useMemo(() => {
    return studentAttendanceList.filter((s) => s.attendanceRate < 75).length;
  }, [studentAttendanceList]);

  const handleTriggerWarning = (student: any) => {
    setSelectedStudentForLetter(student);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleDispatchLetter = () => {
    if (!selectedStudentForLetter) return;
    setToastMessage(`📧 Warning dossier emailed to parents of ${selectedStudentForLetter.name} successfully.`);
    setSelectedStudentForLetter(null);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleAutoWarnAll = () => {
    setToastMessage(`⚡ Bulk warnings emailed to all ${shortageCount} shortage students.`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const branchesList = ["All", "Computer Science", "Electrical Eng", "Mechanical Eng", "Electronics"];

  return (
    <div className="flex min-h-screen bg-[#030712] overflow-x-hidden text-slate-100 font-sans selection:bg-blue-500/20">
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

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <CalendarDays className="text-blue-500" size={26} />
                <span>Attendance Intelligence Center</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                NLP warning letter generation, duplicate IP fraud alerts, and student eligibility tracking.
              </p>
            </div>
            
            <button
              onClick={handleAutoWarnAll}
              disabled={shortageCount === 0}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-xs font-bold text-red-400 px-4.5 py-2.5 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer self-start md:self-auto"
            >
              <Mail size={14} />
              <span>Bulk Warn Shortage Cohorts</span>
            </button>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Attendance</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">{averageAttendance}%</h3>
              <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold mt-2">
                <TrendingUp size={11} />
                <span>+1.5% from last week</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Shortage Alerts</p>
              <h3 className="text-2xl font-extrabold text-red-400 mt-2 font-mono">{shortageCount} Profiles</h3>
              <div className="flex items-center gap-1 text-[9px] text-red-400/80 font-semibold mt-2">
                <ShieldAlert size={11} />
                <span>Flagged under 75%</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Eligibility Index</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">94.5%</h3>
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-2">
                <span>Eligible for term exams</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Projected Term Avg</p>
              <h3 className="text-2xl font-extrabold text-purple-400 mt-2 font-mono">91.4%</h3>
              <div className="flex items-center gap-1 text-[9px] text-purple-400 font-semibold mt-2">
                <Sparkles size={11} className="animate-pulse" />
                <span>AI projected target</span>
              </div>
            </div>
          </div>

          {/* Central Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (8 columns): Heatmaps & Tabbed SVG charts */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Daily Attendance Heatmap */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 select-none">
                  <Activity size={14} className="text-blue-400" />
                  <span>University Check-in Heatmap</span>
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {[...Array(31)].map((_, i) => {
                    let color = "bg-emerald-500/20 border-emerald-500/30";
                    if (i === 12 || i === 19 || i === 27) {
                      color = "bg-red-500/20 border-red-500/30";
                    } else if (i === 4 || i === 15) {
                      color = "bg-yellow-500/20 border-yellow-500/30";
                    }
                    return (
                      <div 
                        key={i} 
                        className={`w-6 h-6 rounded-md border ${color} hover:scale-105 transition duration-150 cursor-default`}
                        title={`Day ${i + 1}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Real-time analytical tabbed charts */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/50 backdrop-blur-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-400" />
                    <span>AI Attendance Trends</span>
                  </h4>

                  <div className="flex bg-slate-900 border border-slate-850 p-1 rounded-xl gap-1 select-none">
                    <button 
                      onClick={() => setActiveChartTab("monthly")}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        activeChartTab === "monthly" ? "bg-slate-950 text-blue-400 border border-white/5" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setActiveChartTab("subjects")}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        activeChartTab === "subjects" ? "bg-slate-950 text-purple-400 border border-white/5" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Subjects
                    </button>
                    <button 
                      onClick={() => setActiveChartTab("departments")}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        activeChartTab === "departments" ? "bg-slate-950 text-pink-400 border border-white/5" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Departments
                    </button>
                  </div>
                </div>

                <div className="h-44 w-full">
                  <AnimatePresence mode="wait">
                    {activeChartTab === "monthly" && (
                      <motion.div key="monthly" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                        <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                          <line x1="0" y1="20" x2="500" y2="20" stroke="#111827" strokeDasharray="3 3" />
                          <line x1="0" y1="75" x2="500" y2="75" stroke="#111827" strokeDasharray="3 3" />
                          <line x1="0" y1="130" x2="500" y2="130" stroke="#111827" strokeDasharray="3 3" />
                          <path d="M 0 110 Q 120 70 250 80 T 500 40 L 500 150 L 0 150 Z" fill="url(#attGlow)" />
                          <path d="M 0 110 Q 120 70 250 80 T 500 40" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                          <defs>
                            <linearGradient id="attGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </motion.div>
                    )}

                    {activeChartTab === "subjects" && (
                      <motion.div key="subjects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                            <span>CS-302 Advanced Algorithms</span>
                            <span className="text-white font-mono">92% Compliance</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: "92%" }} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                            <span>IT-302 Cloud Architecture</span>
                            <span className="text-white font-mono">88% Compliance</span>
                          </div>
                          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: "88%" }} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeChartTab === "departments" && (
                      <motion.div key="departments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex items-center justify-around gap-6">
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center font-bold text-xs text-white font-mono">
                            94%
                          </div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">CSE</span>
                        </div>
                        <div className="text-center space-y-2">
                          <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 flex items-center justify-center font-bold text-xs text-white font-mono">
                            88%
                          </div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">IT</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Filters and search card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-900 shadow">
                <div className="relative group flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition" size={14} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student log..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all font-sans"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter size={12} className="text-slate-500" />
                    <select
                      className="px-3 py-2 rounded-xl border border-slate-900 bg-slate-950 text-[11px] text-slate-300 focus:outline-none font-semibold cursor-pointer"
                      value={filterBranch}
                      onChange={(e) => setFilterBranch(e.target.value)}
                    >
                      {branchesList.map((b) => (
                        <option key={b} value={b} className="bg-slate-950 text-white">{b}</option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showShortagesOnly}
                      onChange={(e) => setShowShortagesOnly(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-800 bg-slate-950 accent-red-500 text-red-500 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-400 font-semibold">Shortages Only</span>
                  </label>
                </div>
              </div>

              {/* Student table list */}
              <div className="rounded-3xl border border-white/5 bg-slate-950/40 overflow-hidden shadow-2xl overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-900/10">
                      <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Student</th>
                      <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4 font-mono">Roll Number</th>
                      <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Held/Present</th>
                      <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4 text-center">Eligibility</th>
                      <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-slate-900/60">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500 font-medium">
                          No attendance registers matched the criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/20 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white text-xs font-mono">
                                {log.name.charAt(0)}
                              </div>
                              <span className="text-xs font-semibold text-white">{log.name}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                            {log.roll}
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                            {log.presentClasses}/{log.totalClasses} lectures
                          </td>

                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold border ${
                              log.eligibility === "Eligible" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}>
                              {log.eligibility}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            {log.isAtRisk ? (
                              <button
                                onClick={() => handleTriggerWarning(log)}
                                className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-[10px] font-bold text-red-400 transition cursor-pointer"
                              >
                                Trigger Warning
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold text-emerald-400 flex items-center justify-end gap-1 select-none">
                                <CheckCircle size={10} />
                                <span>Compliant</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Right Column (4 columns): Fraud Detection & Warnings Preview */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* AI Fraud Detection Placeholder */}
              <div className="p-5 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-xl space-y-3 relative overflow-hidden group shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold text-white flex items-center gap-2 select-none uppercase tracking-wider">
                  <AlertTriangle size={14} className="text-red-400 animate-pulse" />
                  <span>AI Proxy Fraud Alert</span>
                </h3>
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-2xl space-y-2">
                  <p className="text-[11px] font-bold text-red-400">Duplicate Check-in Signature</p>
                  <p className="text-[9px] text-slate-500 leading-normal">
                    Two student accounts successfully checked into CS-302 Algorithms using identical IP address keys from Cabin 3. Proxy checked alert logged.
                  </p>
                  <button 
                    onClick={() => triggerToast("Security alert filed. Student profiles flagged.")}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    Flag Security Logs
                  </button>
                </div>
              </div>

              {/* AI Prediction Shortage Alerts */}
              <div className="rounded-3xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-xl space-y-5 shadow-lg">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 select-none uppercase tracking-wider pb-3 border-b border-slate-900">
                  <Sparkles size={14} className="text-purple-400" />
                  <span>AI Shortage Warning Queue</span>
                </h3>

                <div className="space-y-4.5">
                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Neha Reddy</span>
                      <span className="text-[10px] font-bold text-red-400 font-mono">58%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Attendance target blocked. Projected maximum is 71%, indicating a mandatory shortage warning notice.
                    </p>
                    <button 
                      onClick={() => handleTriggerWarning({ name: "Neha Reddy", roll: "APEX-2026-002", attendanceRate: 58, branch: "Computer Science" })}
                      className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Mail size={10} />
                      <span>Issue warning notice</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Anya Sen</span>
                      <span className="text-[10px] font-bold text-red-400 font-mono">64%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Requires attending next 8 classes consecutively to restore compliant eligibility status.
                    </p>
                    <button 
                      onClick={() => handleTriggerWarning({ name: "Anya Sen", roll: "APEX-2026-044", attendanceRate: 64, branch: "Information Tech" })}
                      className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Mail size={10} />
                      <span>Issue warning notice</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* SECTION Parent Notification Letter Preview Dialog */}
          <AnimatePresence>
            {selectedStudentForLetter && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedStudentForLetter(null)}
                  className="fixed inset-0 z-40 bg-black"
                />

                <motion.div 
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:max-w-lg md:mx-auto z-50 rounded-3xl border border-white/5 bg-slate-950 p-6 shadow-2xl space-y-6 select-none"
                >
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <Sparkles size={14} className="text-purple-400" />
                      <span>AI Parent Notification Preview</span>
                    </h3>
                    <button 
                      onClick={() => setSelectedStudentForLetter(null)}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white transition cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-3 font-sans text-slate-300 text-xs leading-relaxed">
                    <p className="font-semibold text-white">To the Parents/Guardian of {selectedStudentForLetter.name},</p>
                    <p>
                      This is an automated academic alert generated by the <span className="font-bold text-white">SHIVIL AI Operating System</span>.
                    </p>
                    <p>
                      We regret to inform you that your ward's attendance in the current semester lectures has dropped to <span className="font-bold text-red-400">{selectedStudentForLetter.attendanceRate}%</span>, which is below the mandatory <span className="font-semibold text-white">75%</span> eligibility index.
                    </p>
                    <p>
                      Current stats: <span className="font-semibold text-white">{selectedStudentForLetter.presentClasses || 35} Present</span> / <span className="font-semibold text-white">{selectedStudentForLetter.totalClasses || 60} Periods held</span>.
                    </p>
                    <p className="text-slate-500 font-mono text-[9px] mt-4 border-t border-slate-900 pt-3">
                      CC: Department Advisor • Registrar Admin Office
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-900">
                    <button 
                      onClick={() => setSelectedStudentForLetter(null)}
                      className="px-4 py-2 rounded-xl border border-slate-900 bg-slate-950 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      Discard Draft
                    </button>
                    <button 
                      onClick={handleDispatchLetter}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Send size={12} />
                      <span>Dispatch Alert Dossier</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

export default Attendance;
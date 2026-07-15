import { useState, useEffect, useMemo } from "react";
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
  CheckCircle2
} from "lucide-react";
import type { Student } from "../types/student";
import { studentService } from "../services/studentService";

function Attendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filterBranch, setFilterBranch] = useState("All");
  const [showShortagesOnly, setShowShortagesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

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
      // Map static attendance rates matching our seed status
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
        isAtRisk: rate < 75
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

  const handleTriggerWarning = (studentName: string) => {
    setToastMessage(`📧 Warn alert dispatched successfully to ${studentName} & Faculty advisor.`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleAutoWarnAll = () => {
    setToastMessage(`⚡ Bulk warnings emailed to all ${shortageCount} shortage students.`);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const branchesList = ["All", "Computer Science", "Electrical Eng", "Mechanical Eng", "Electronics"];

  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />

      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8 relative">
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-500/30 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl shadow-2xl animate-bounce-slow">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <CalendarDays className="text-blue-500" size={28} />
                <span>Attendance Audit Terminal</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Predictive attendance analytics, automated warnings dispatch, and shortage reports.
              </p>
            </div>
            
            <button
              onClick={handleAutoWarnAll}
              disabled={shortageCount === 0}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold text-red-400 px-4 py-2.5 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed self-start md:self-auto"
            >
              <Mail size={14} />
              <span>Email Warnings to All Shortages</span>
            </button>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="relative rounded-2xl border border-white/5 bg-slate-900/60 p-6 backdrop-blur-xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average Attendance</p>
              <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{averageAttendance}%</h3>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-2.5">
                <TrendingUp size={12} />
                <span>+1.5% from last week</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-900/60 p-6 backdrop-blur-xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">Shortage Alerts</p>
              <h3 className="text-3xl font-extrabold text-red-400 mt-2 font-mono">{shortageCount} Students</h3>
              <div className="flex items-center gap-1 text-[10px] text-red-400/80 font-semibold mt-2.5">
                <ShieldAlert size={12} />
                <span>Below 75% target</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-900/60 p-6 backdrop-blur-xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Classes Held</p>
              <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">60 Periods</h3>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mt-2.5">
                <span>99.8% scheduling efficiency</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-900/60 p-6 backdrop-blur-xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Projected Term Avg</p>
              <h3 className="text-3xl font-extrabold text-purple-400 mt-2 font-mono">91.4%</h3>
              <div className="flex items-center gap-1 text-[10px] text-purple-400 font-semibold mt-2.5">
                <Sparkles size={12} className="animate-pulse" />
                <span>AI projected target</span>
              </div>
            </div>

          </div>

          {/* Central Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left table column (8 columns) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Filters and Search row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-900">
                
                {/* Search */}
                <div className="relative group flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={14} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student log..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div className="flex items-center gap-3">
                  
                  {/* Branch filter select */}
                  <div className="flex items-center gap-2">
                    <Filter size={12} className="text-slate-500" />
                    <select
                      className="px-3 py-2 rounded-xl border border-slate-900 bg-slate-950 text-[11px] text-slate-300 focus:outline-none font-semibold"
                      value={filterBranch}
                      onChange={(e) => setFilterBranch(e.target.value)}
                    >
                      {branchesList.map((b) => (
                        <option key={b} value={b} className="bg-slate-950 text-white">{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Shortage Toggle */}
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

              {/* Logs Table Card */}
              <div className="rounded-3xl border border-white/5 bg-slate-950/40 overflow-hidden shadow-2xl overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-900/10">
                      <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Student</th>
                      <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Branch</th>
                      <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Periods Held/Present</th>
                      <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Ratio</th>
                      <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4 text-right">Warning Status</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-slate-900/60">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-xs text-slate-500 font-medium">
                          No attendance registers matched the current criteria.
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
                              <div>
                                <p className="text-xs font-semibold text-white">{log.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{log.roll}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-300">
                            {log.branch}
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                            {log.presentClasses}/{log.totalClasses} lectures
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden shrink-0 border border-slate-800/40">
                                <div 
                                  className={`h-full rounded-full ${log.isAtRisk ? "bg-red-500" : "bg-blue-500"}`}
                                  style={{ width: `${log.attendanceRate}%` }}
                                />
                              </div>
                              <span className={`text-xs font-bold font-mono ${log.isAtRisk ? "text-red-400" : "text-blue-400"}`}>
                                {log.attendanceRate}%
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            {log.isAtRisk ? (
                              <button
                                onClick={() => handleTriggerWarning(log.name)}
                                className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-[10px] font-bold text-red-400 transition"
                              >
                                Trigger Warning
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold text-emerald-400 flex items-center justify-end gap-1">
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

            {/* Right sidebar column (4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* AI predictive panel */}
              <div className="rounded-3xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-xl space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Sparkles size={14} className="animate-pulse" />
                  </div>
                  <h3 className="text-sm font-bold text-white">AI Shortage Predictions</h3>
                </div>

                <div className="space-y-4">
                  
                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Neha Reddy</span>
                      <span className="text-[10px] font-mono font-bold text-red-400 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">Critical: 58%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Missing the next lecture on Friday will drop attendance to 56%. Projected term maximum is 71%, indicating a definitive shortage alert status.
                    </p>
                    <button 
                      onClick={() => handleTriggerWarning("Neha Reddy")}
                      className="w-full py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
                    >
                      <Mail size={10} />
                      <span>Issue Notice</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Anya Sen</span>
                      <span className="text-[10px] font-mono font-bold text-red-400 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">Alert: 64%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Requires attending the next 8 consecutive class periods to cross the 75% boundary. Currently under active warning.
                    </p>
                    <button 
                      onClick={() => handleTriggerWarning("Anya Sen")}
                      className="w-full py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
                    >
                      <Mail size={10} />
                      <span>Issue Notice</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Rohan Gupta</span>
                      <span className="text-[10px] font-mono font-bold text-yellow-400 px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20">Borderline: 74%</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Currently 1 period away from compliance. One absence will drop status to Shortage.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Attendance;
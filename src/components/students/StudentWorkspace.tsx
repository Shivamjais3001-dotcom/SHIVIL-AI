import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  Sparkles,
  TrendingUp,
  AlertCircle,
  FileText,
  CheckCircle2,
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Download,
  Mail,
  BookOpen,
  Clock,
  FileDown,
  ShieldAlert,
  BarChart3,
  Activity,
  Home,
  MessageSquare
} from "lucide-react";
import type { Student } from "../../types/student";

interface StudentWorkspaceProps {
  student: Student;
  onBack: () => void;
  onEdit: (student: Student) => void;
}

function StudentWorkspace({ student, onBack, onEdit }: StudentWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"academics" | "attendance" | "placements" | "timeline">("academics");
  const [toastMessage, setToastMessage] = useState("");

  // Calculate simulated mock metrics based on student profile name
  const metrics = useMemo(() => {
    const name = student.name;
    let cgpa = "8.85";
    let attendance = "92.0%";
    let risk = { score: 12, label: "Low Risk", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" };
    let readiness = 88;
    let aiSummary = "";
    let timeline: Array<{ title: string; desc: string; date: string; icon: React.ReactNode; color: string }> = [];
    let skills: Array<{ name: string; value: number }> = [];

    if (name.includes("Neha")) {
      cgpa = "6.85";
      attendance = "58.0%";
      risk = { score: 82, label: "Critical High Risk", color: "text-red-400 border-red-500/20 bg-red-500/5 animate-pulse" };
      readiness = 35;
      aiSummary = "Attendance has critically dropped to 58.0% this month. Recommended to schedule immediate academic counseling. AI projects a pass-fail warning in CS-302 Algorithms. Strong laboratory records but classroom presence is inadequate.";
      skills = [
        { name: "Algorithm Analysis", value: 45 },
        { name: "Frontend Design", value: 70 },
        { name: "Data Structures", value: 50 },
        { name: "System Integration", value: 30 }
      ];
      timeline = [
        { title: "Attendance warning logged", desc: "Syllabus check flagged 58% presence in CSE", date: "2 hours ago", icon: <ShieldAlert size={14} />, color: "bg-red-500/10 border-red-500/20 text-red-400" },
        { title: "Marks update: Internal exam I", desc: "Scored 14/30 in CS-302 Algorithms", date: "2 weeks ago", icon: <FileText size={14} />, color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
        { title: "Hostel check-in log updated", desc: "Warden report: On-campus check compliant", date: "July 12, 2026", icon: <Home size={14} />, color: "bg-blue-500/10 border-blue-500/20 text-blue-400" }
      ];
    } else if (name.includes("Priya") || name.includes("Patel")) {
      cgpa = "9.42";
      attendance = "96.5%";
      risk = { score: 4, label: "Negligible Risk", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" };
      readiness = 96;
      aiSummary = "Excellent academic trajectory with 9.42 CGPA. Resume parsing scores 94%. Candidate is fully ready for Tier-1 placements. Has completed 3 professional cloud certifications. Study logs represent consistent peer mentoring.";
      skills = [
        { name: "Algorithm Analysis", value: 95 },
        { name: "Frontend Design", value: 92 },
        { name: "Data Structures", value: 98 },
        { name: "System Integration", value: 90 }
      ];
      timeline = [
        { title: "AWS Cloud Practitioner Badge", desc: "Uploaded verified AWS certificate to profile", date: "Today", icon: <Award size={14} />, color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
        { title: "Algorithms midterm marks verified", desc: "Scored 29/30 (Course topper)", date: "Last week", icon: <CheckCircle2 size={14} />, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
        { title: "Semester III registration completed", desc: "Syllabus path locked by superadmin", date: "June 28, 2026", icon: <GraduationCap size={14} />, color: "bg-blue-500/10 border-blue-500/20 text-blue-400" }
      ];
    } else {
      // Default placeholder metrics
      cgpa = "8.24";
      attendance = "88.0%";
      risk = { score: 18, label: "Stable Low Risk", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" };
      readiness = 78;
      aiSummary = "Maintains solid progress with an 8.24 CGPA. Classroom participation is healthy. Recommended to optimize project work and coding logs to increase placement readiness to 85%+ bounds.";
      skills = [
        { name: "Algorithm Analysis", value: 80 },
        { name: "Frontend Design", value: 78 },
        { name: "Data Structures", value: 84 },
        { name: "System Integration", value: 72 }
      ];
      timeline = [
        { title: "Marks verified: Internal exam I", desc: "Scored 24/30 in CS-302 Algorithms", date: "3 days ago", icon: <FileText size={14} />, color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
        { title: "Attendance check verified", desc: "88% compliance matched requirements", date: "July 12, 2026", icon: <CheckCircle2 size={14} />, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" }
      ];
    }

    return { cgpa, attendance, risk, readiness, aiSummary, timeline, skills };
  }, [student]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Toast Alert */}
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

      {/* Control Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-5">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition duration-200 cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Students Registry</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-[10px] text-blue-400 font-bold uppercase tracking-wider">
          <Sparkles size={12} className="animate-pulse" />
          <span>Student Intelligence Terminal</span>
        </div>
      </div>

      {/* SECTION 1: Premium Student Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950/60 p-6 md:p-8 backdrop-blur-2xl flex flex-col md:flex-row justify-between gap-6 shadow-xl group">
        {/* Glow rings */}
        <div className="absolute top-0 right-0 w-84 h-84 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:opacity-75 transition duration-500" />
        
        <div className="flex items-start gap-4.5 relative z-10">
          {/* Avatar Photo Placeholder */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 border border-blue-500/35 flex items-center justify-center font-bold text-white text-2xl font-mono shrink-0 shadow-lg">
            {student.name.charAt(0)}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">{student.name}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold border ${
                student.status === "Active" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse"
              }`}>
                {student.status}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-semibold font-mono">{student.roll}</p>
            <div className="flex gap-4 text-xs font-semibold text-slate-400 pt-1.5">
              <span>{student.branch}</span>
              <span className="text-slate-700">•</span>
              <span>Year {student.year}</span>
              <span className="text-slate-700">•</span>
              <span>Section A</span>
            </div>
          </div>
        </div>

        {/* Dynamic Key metrics highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 md:min-w-[420px]">
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">CGPA INDEX</p>
            <p className="text-xl font-bold text-white font-mono">{metrics.cgpa}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">ATTENDANCE</p>
            <p className="text-xl font-bold text-white font-mono">{metrics.attendance}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">AI RISK SCORE</p>
            <p className={`text-xl font-bold font-mono ${student.status === "Shortage" ? "text-red-400" : "text-emerald-400"}`}>{metrics.risk.score}%</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">READINESS</p>
            <p className="text-xl font-bold text-purple-400 font-mono">{metrics.readiness}%</p>
          </div>
        </div>
      </div>

      {/* Main Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Summary, Graphs, Heatmaps */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 2: AI Student Summary Card */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/60 p-6 backdrop-blur-xl relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-4 select-none">
              <Sparkles size={15} className="text-purple-400 animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">SHIVIL AI Executive Summary</h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans font-medium">
              {metrics.aiSummary}
            </p>
          </div>

          {/* Tab Selector & Graphics Container */}
          <div className="space-y-5">
            <div className="flex bg-slate-950 border border-white/5 p-1 rounded-2xl gap-1 w-fit select-none">
              <button 
                onClick={() => setActiveTab("academics")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-tight transition duration-200 cursor-pointer ${
                  activeTab === "academics" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Academics
              </button>
              <button 
                onClick={() => setActiveTab("attendance")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-tight transition duration-200 cursor-pointer ${
                  activeTab === "attendance" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Attendance Heatmap
              </button>
              <button 
                onClick={() => setActiveTab("placements")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-tight transition duration-200 cursor-pointer ${
                  activeTab === "placements" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Placements Ready
              </button>
              <button 
                onClick={() => setActiveTab("timeline")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-tight transition duration-200 cursor-pointer ${
                  activeTab === "timeline" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Timeline
              </button>
            </div>

            {/* Content Windows */}
            <div className="rounded-3xl border border-white/5 bg-slate-950/40 p-6 md:p-8 backdrop-blur-xl min-h-[340px] shadow-lg">
              
              {/* SECTION 3: Academic Curves */}
              {activeTab === "academics" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">CGPA Semester Curves</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Historical GPA tracking mapped over past terms</p>
                  </div>
                  
                  {/* Dynamic SVG Curves */}
                  <div className="h-52 w-full pt-4">
                    <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="30" x2="500" y2="30" stroke="#111827" strokeDasharray="3 3" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="#111827" strokeDasharray="3 3" />
                      <line x1="0" y1="150" x2="500" y2="150" stroke="#111827" strokeDasharray="3 3" />

                      <path 
                        d="M 20 150 L 100 120 Q 200 60 300 80 T 480 40 L 480 180 L 20 180 Z" 
                        fill="url(#gpaGrad)"
                      />

                      <motion.path 
                        d="M 20 150 L 100 120 Q 200 60 300 80 T 480 40" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="2.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7 }}
                      />
                      <circle cx="100" cy="120" r="4" fill="#3b82f6" stroke="#030712" strokeWidth="1.5" />
                      <circle cx="300" cy="80" r="4" fill="#a78bfa" stroke="#030712" strokeWidth="1.5" />
                      <circle cx="480" cy="40" r="4" fill="#ec4899" stroke="#030712" strokeWidth="1.5" />
                    </svg>
                  </div>
                  
                  <div className="flex gap-6 text-[10px] font-mono text-slate-500 border-t border-slate-900/60 pt-4">
                    <span>Sem I: 7.20</span>
                    <span>Sem II: 8.10</span>
                    <span>Sem III (Target): {metrics.cgpa}</span>
                  </div>
                </motion.div>
              )}

              {/* SECTION 4: Attendance Heatmap */}
              {activeTab === "attendance" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-900/60 pb-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">Monthly Attendance Heatmap</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Checks compliance ledger status daily</p>
                    </div>
                    <div className="text-[10px] font-semibold px-2 py-0.5 rounded border border-purple-500/25 bg-purple-500/5 text-purple-400">
                      Prediction: {student.status === "Shortage" ? "Non-compliant 60% expected" : "94% compliant projected"}
                    </div>
                  </div>

                  {/* GitHub contribution style heatmap grid */}
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-7 gap-2.5 max-w-sm">
                      {[...Array(30)].map((_, i) => {
                        let color = "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"; // Present
                        if (student.status === "Shortage") {
                          if (i % 3 === 0) color = "bg-red-500/20 border-red-500/30 text-red-400"; // Absent
                          else if (i % 4 === 0) color = "bg-yellow-500/20 border-yellow-500/30 text-yellow-400"; // Moderate
                        } else {
                          if (i === 12 || i === 22) color = "bg-red-500/20 border-red-500/30 text-red-400";
                        }
                        return (
                          <div 
                            key={i}
                            className={`aspect-square rounded-md border ${color} hover:scale-105 transition`}
                            title={`Day ${i + 1}`}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 pt-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
                        <span>Present</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" />
                        <span>Absent</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/30" />
                        <span>Late Check-in</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION 5: Placement Ready */}
              {activeTab === "placements" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">Skill Matrix & Index Progress</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Coding performance algorithms compared against tier-1 constraints</p>
                  </div>

                  <div className="space-y-4">
                    {metrics.skills.map((skill, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-400">{skill.name}</span>
                          <span className="text-white font-mono">{skill.value}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                            style={{ width: `${skill.value}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SECTION 7: Student Timeline Feed */}
              {activeTab === "timeline" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="relative pl-6 border-l border-slate-900 space-y-6 ml-2 text-xs">
                    {metrics.timeline.map((item, idx) => (
                      <div key={idx} className="relative">
                        <span className={`absolute -left-[30px] top-0 w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${item.color}`}>
                          {item.icon}
                        </span>
                        <p className="font-semibold text-white leading-none">{item.title}</p>
                        <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">{item.desc} • {item.date}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </div>
          </div>

          {/* SECTION 10: Documents Hub */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider select-none">
              <FileText size={15} className="text-blue-400" />
              <span>Academic Documents Catalog</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div 
                onClick={() => triggerToast("ID Card download initialized.")}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-800 transition cursor-pointer flex items-center justify-between group/doc"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={15} className="text-slate-500 group-hover/doc:text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate leading-none">University ID Card</p>
                    <p className="text-[9px] text-slate-500 mt-1 leading-none">PDF • Verified</p>
                  </div>
                </div>
                <FileDown size={14} className="text-slate-500 group-hover/doc:text-white transition shrink-0" />
              </div>

              <div 
                onClick={() => triggerToast("Marksheet Semester I download initialized.")}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-800 transition cursor-pointer flex items-center justify-between group/doc"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={15} className="text-slate-500 group-hover/doc:text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate leading-none">Semester I Mark Sheet</p>
                    <p className="text-[9px] text-slate-500 mt-1 leading-none">PDF • Locked</p>
                  </div>
                </div>
                <FileDown size={14} className="text-slate-500 group-hover/doc:text-white transition shrink-0" />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Action Center, Recommendations */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SECTION 8: AI Recommendation Center */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
              <Sparkles size={15} className="text-purple-400" />
              <span>AI Recommendation Center</span>
            </h3>

            <div className="space-y-3">
              {student.status === "Shortage" ? (
                <>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-850 transition">
                    <p className="text-[11px] font-bold text-white">Arrange Mathematics Tutoring</p>
                    <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Arrange extra lectures to make up for attendance and performance lag.</p>
                    <button 
                      onClick={() => triggerToast("Math session notification scheduled.")}
                      className="mt-3 text-[10px] font-bold text-purple-400 hover:text-white transition cursor-pointer"
                    >
                      Arrange Tutoring
                    </button>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-850 transition">
                    <p className="text-[11px] font-bold text-white">Schedule Counseling</p>
                    <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Schedule counseling for continuous absent trends.</p>
                    <button 
                      onClick={() => triggerToast("Counseling request filed.")}
                      className="mt-3 text-[10px] font-bold text-purple-400 hover:text-white transition cursor-pointer"
                    >
                      File Request
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-850 transition">
                    <p className="text-[11px] font-bold text-white">Approve Placement Readiness</p>
                    <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Candidate qualifies for tier-1 recruiter pipelines.</p>
                    <button 
                      onClick={() => triggerToast("Placement approval flagged.")}
                      className="mt-3 text-[10px] font-bold text-purple-400 hover:text-white transition cursor-pointer"
                    >
                      Authorize Profile
                    </button>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-850 transition">
                    <p className="text-[11px] font-bold text-white">Scholarship Verification</p>
                    <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Eligible for academic cohort scholarship verified for this semester.</p>
                    <button 
                      onClick={() => triggerToast("Scholarship invitation sent.")}
                      className="mt-3 text-[10px] font-bold text-purple-400 hover:text-white transition cursor-pointer"
                    >
                      Invite Student
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SECTION 9: Quick Actions */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white tracking-tight">Quick Registry Actions</h3>

            <div className="grid grid-cols-1 gap-2.5">
              <button 
                onClick={() => onEdit(student)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition flex items-center justify-between px-4 group/btn"
              >
                <span>Edit Profile Registry</span>
                <ChevronRight size={13} className="text-slate-500 group-hover/btn:translate-x-0.5 transition" />
              </button>

              <button 
                onClick={() => triggerToast("Interactive AI analysis report generated.")}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-950/20 to-purple-950/20 hover:from-blue-900/30 hover:to-purple-900/30 border border-blue-500/10 text-xs font-bold text-blue-400 hover:text-white cursor-pointer transition flex items-center justify-between px-4 group/btn"
              >
                <span>Compile AI analysis</span>
                <Sparkles size={13} className="text-blue-500 group-hover/btn:rotate-12 transition shrink-0" />
              </button>

              <button 
                onClick={() => triggerToast("Transcript generated successfully.")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition flex items-center justify-between px-4 group/btn"
              >
                <span>Download transcript</span>
                <FileDown size={13} className="text-slate-500 group-hover/btn:translate-y-0.5 transition shrink-0" />
              </button>

              <button 
                onClick={() => triggerToast("Email dispatched to student.")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition flex items-center justify-between px-4 group/btn"
              >
                <span>Email student</span>
                <Mail size={13} className="text-slate-500 group-hover/btn:translate-x-0.5 transition shrink-0" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default StudentWorkspace;

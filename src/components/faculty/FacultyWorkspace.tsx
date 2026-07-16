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
  MessageSquare,
  BookOpenCheck,
  Search,
  FolderDot
} from "lucide-react";
import type { Faculty } from "../../types/faculty";

interface FacultyWorkspaceProps {
  professor: Faculty;
  onBack: () => void;
  onEdit: (professor: Faculty) => void;
}

function FacultyWorkspace({ professor, onBack, onEdit }: FacultyWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"teaching" | "research" | "feedback" | "timeline">("teaching");
  const [toastMessage, setToastMessage] = useState("");

  // Calculate dynamic mock metrics based on faculty department/details
  const metrics = useMemo(() => {
    const name = professor.name;
    let designation = "Associate Professor";
    let experience = "8 Years";
    let specialization = "Artificial Intelligence";
    let productivity = 92;
    let teachingScore = 88;
    let researchScore = 86;
    let feedbackRating = "4.8";
    let aiSummary = "";
    
    let subjects = ["CS-302 Advanced Algorithms", "CS-101 Introduction to AI"];
    let pendingAttendance = 0;
    let syllabusProgress = 82;
    
    let publications = 14;
    let patents = 2;
    let hIndex = 12;
    let funding = "$48K";

    if (name.includes("Jenkins") || professor.department.includes("Computer")) {
      designation = "Professor & Lab Chair";
      experience = "12 Years";
      specialization = "Deep Learning & NLP";
      productivity = 96;
      teachingScore = 94;
      researchScore = 92;
      feedbackRating = "4.9";
      aiSummary = "Consistently achieves top-tier student reviews (4.9/5.0). Research publication rate in IEEE has increased by 15% this year. Syllabus coverage for advanced modules is fully aligned with calendar goals. Overloaded by 4 hours this week; workload balancing recommended.";
      subjects = ["CS-302 Advanced Algorithms", "CS-401 Machine Learning", "CS-501 Neural Networks"];
      pendingAttendance = 0;
      syllabusProgress = 90;
      publications = 28;
      patents = 4;
      hIndex = 18;
      funding = "$140K";
    } else {
      aiSummary = "Maintains solid teaching indexes. Classroom engagement is rated high. Research patents are in the pending approval stage. Recommended for advanced course syllabus builder allocations.";
    }

    const schedule = [
      { time: "09:00 AM - 10:30 AM", event: "CS-302 Algorithms Lecture", room: "Room 402" },
      { time: "11:00 AM - 12:00 PM", event: "Office Hour: Syllabus Auditing", room: "Department Cabin 3" },
      { time: "02:30 PM - 04:00 PM", event: "Faculty Senate Meeting", room: "Senate Hall" }
    ];

    const timeline = [
      { title: "Research paper published", desc: "Published 'Transformer Optimizations in ERP Systems' in IEEE", date: "3 days ago", icon: <FileText size={14} />, color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
      { title: "Weekly attendance logged", desc: "Syllabus metrics registered and finalized", date: "Yesterday", icon: <CheckCircle2 size={14} />, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
      { title: "Exam sheets locked", desc: "Midterm grading curves uploaded successfully", date: "Last week", icon: <BookOpenCheck size={14} />, color: "bg-purple-500/10 border-purple-500/20 text-purple-400" }
    ];

    return { 
      designation, 
      experience, 
      specialization, 
      productivity, 
      teachingScore, 
      researchScore, 
      feedbackRating, 
      aiSummary,
      subjects,
      pendingAttendance,
      syllabusProgress,
      publications,
      patents,
      hIndex,
      funding,
      schedule,
      timeline
    };
  }, [professor]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="space-y-8 select-none text-slate-100 font-sans">
      
      {/* Toast popup */}
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
          <span>Back to Faculty Directory</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-[10px] text-blue-400 font-bold uppercase tracking-wider">
          <Sparkles size={12} className="animate-pulse" />
          <span>Faculty Intelligence Workspace</span>
        </div>
      </div>

      {/* SECTION 1: Premium Faculty Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950/60 p-6 md:p-8 backdrop-blur-2xl flex flex-col md:flex-row justify-between gap-6 shadow-xl group">
        <div className="absolute top-0 right-0 w-84 h-84 bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:opacity-75 transition duration-500" />
        
        <div className="flex items-start gap-4.5 relative z-10">
          {/* Avatar Photo placeholder */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 border border-purple-500/35 flex items-center justify-center font-bold text-white text-2xl font-mono shrink-0 shadow-lg">
            {professor.name.replace("Dr. ", "").replace("Prof. ", "").charAt(0)}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{professor.name}</h2>
            <p className="text-slate-500 text-xs font-semibold font-mono">{metrics.designation} • EMP-{professor.id * 100 + 400}</p>
            <div className="flex gap-4 text-xs font-semibold text-slate-400 pt-1.5 flex-wrap">
              <span>{professor.department}</span>
              <span className="text-slate-700">•</span>
              <span>{metrics.experience} Experience</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-500 font-medium">Specialization: {metrics.specialization}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Key metrics highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 md:min-w-[420px]">
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">PRODUCTIVITY</p>
            <p className="text-xl font-bold text-white font-mono">{metrics.productivity}%</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">TEACHING SCORE</p>
            <p className="text-xl font-bold text-white font-mono">{metrics.teachingScore}%</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">RESEARCH INDEX</p>
            <p className="text-xl font-bold text-purple-400 font-mono">h-{metrics.hIndex}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">FEEDBACK</p>
            <p className="text-xl font-bold text-blue-400 font-mono">{metrics.feedbackRating}/5.0</p>
          </div>
        </div>
      </div>

      {/* Main Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Summary, Graphs, Research widgets */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 2: AI Faculty Summary Card */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/60 p-6 backdrop-blur-xl relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-4 select-none">
              <Sparkles size={15} className="text-blue-400 animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">SHIVIL AI Performance Summary</h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans font-medium">
              {metrics.aiSummary}
            </p>
          </div>

          {/* Tab Selector & Graphics Container */}
          <div className="space-y-5">
            <div className="flex bg-slate-950 border border-white/5 p-1 rounded-2xl gap-1 w-fit select-none">
              <button 
                onClick={() => setActiveTab("teaching")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-tight transition duration-200 cursor-pointer ${
                  activeTab === "teaching" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Teaching Analytics
              </button>
              <button 
                onClick={() => setActiveTab("research")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-tight transition duration-200 cursor-pointer ${
                  activeTab === "research" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Research core
              </button>
              <button 
                onClick={() => setActiveTab("feedback")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-tight transition duration-200 cursor-pointer ${
                  activeTab === "feedback" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Student Reviews
              </button>
              <button 
                onClick={() => setActiveTab("timeline")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-tight transition duration-200 cursor-pointer ${
                  activeTab === "timeline" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Accomplishments
              </button>
            </div>

            {/* Content Windows */}
            <div className="rounded-3xl border border-white/5 bg-slate-950/40 p-6 md:p-8 backdrop-blur-xl min-h-[340px] shadow-lg">
              
              {/* SECTION 3: Teaching Analytics */}
              {activeTab === "teaching" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">Lecture Loads & Syllabus Progress</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Assigned offerings this semester</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-500/25 bg-blue-500/5 text-blue-400 font-mono">
                      Target Uptime Compliance: 100%
                    </span>
                  </div>

                  <div className="space-y-5">
                    {metrics.subjects.map((sub, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900/60 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <BookOpen size={16} className="text-blue-400 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-white leading-none">{sub}</p>
                            <p className="text-[9px] text-slate-500 mt-1.5 leading-none">Weekly Load: 4 Lectures • Core Elective</p>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Syllabus</span>
                            <span className="text-xs font-bold text-white font-mono">{idx === 0 ? "84%" : "72%"} Done</span>
                          </div>
                          <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden shrink-0">
                            <div className="h-full bg-blue-500" style={{ width: idx === 0 ? "84%" : "72%" }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SECTION 4: Research Core */}
              {activeTab === "research" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-900/60 pb-3">
                    <h4 className="text-sm font-bold text-white">Research Dossier Index</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Publications and pending patents overview</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 text-center space-y-1">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Publications</p>
                      <p className="text-xl font-bold text-white font-mono">{metrics.publications}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 text-center space-y-1">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Patents Pending</p>
                      <p className="text-xl font-bold text-white font-mono">{metrics.patents}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 text-center space-y-1">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">h-Index Scale</p>
                      <p className="text-xl font-bold text-purple-400 font-mono">{metrics.hIndex}</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 text-center space-y-1">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Active Funding</p>
                      <p className="text-xl font-bold text-emerald-400 font-mono">{metrics.funding}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECTION 5: Student Reviews Sentiment */}
              {activeTab === "feedback" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-900/60 pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Student Review & Feedback Sentiment</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Calculated by NLP sentiment analyzer weekly</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-mono">
                      96.4% POSITIVE
                    </span>
                  </div>

                  {/* SVG feedback lines */}
                  <div className="h-44 w-full">
                    <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                      <line x1="0" y1="20" x2="500" y2="20" stroke="#111827" strokeDasharray="3 3" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="#111827" strokeDasharray="3 3" />
                      <line x1="0" y1="130" x2="500" y2="130" stroke="#111827" strokeDasharray="3 3" />

                      <motion.path 
                        d="M 20 80 Q 150 40 280 50 T 480 30" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="3.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7 }}
                      />
                      <circle cx="280" cy="50" r="4" fill="#3b82f6" stroke="#030712" strokeWidth="1.5" />
                      <circle cx="480" cy="30" r="4" fill="#8b5cf6" stroke="#030712" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 space-y-1">
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={12} className="text-blue-400" />
                      <span>Top Sentiment Keywords</span>
                    </p>
                    <p className="text-[11px] text-slate-400 leading-normal mt-1">
                      💡 Students highlight: <span className="text-white font-semibold">"Clear syllabus mappings"</span>, <span className="text-white font-semibold">"Extremely responsive during office hours"</span>, and <span className="text-white font-semibold">"Highly interactive lab sessions"</span>.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* SECTION 8: Chronological Accomplishments Timeline */}
              {activeTab === "timeline" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="relative pl-6 border-l border-slate-900 space-y-6 ml-2 text-xs">
                    {metrics.timeline.map((item, idx) => (
                      <div key={idx} className="relative animate-slide-in">
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

          {/* SECTION 7: Schedule Widget */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider select-none">
              <Calendar size={15} className="text-blue-400" />
              <span>Today's Calendar Queue</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {metrics.schedule.map((sch, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 space-y-1">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{sch.time}</p>
                  <p className="text-xs font-semibold text-white truncate">{sch.event}</p>
                  <p className="text-[9px] text-slate-500 font-medium leading-none mt-1">{sch.room}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Action Center, Recommendations */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SECTION 6: AI Suggestions & Suggestions */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
              <Sparkles size={15} className="text-purple-400" />
              <span>AI Suggestions & Suggestions</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-850 transition">
                <p className="text-[11px] font-bold text-white">Resolve Workload Overload</p>
                <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Weekly load exceeds 16-hour contract index limits. Recommend rescheduling algorithms lab.</p>
                <button 
                  onClick={() => triggerToast("Workload optimization proposal emailed.")}
                  className="mt-3 text-[10px] font-bold text-purple-400 hover:text-white transition cursor-pointer"
                >
                  Balance Workload
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-850 transition">
                <p className="text-[11px] font-bold text-white">Approve Research Grant</p>
                <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Qualifies for the university's internal AI research funding tier.</p>
                <button 
                  onClick={() => triggerToast("Research funding request submitted.")}
                  className="mt-3 text-[10px] font-bold text-purple-400 hover:text-white transition cursor-pointer"
                >
                  Approve Grant
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 9: Quick Actions */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white tracking-tight">Quick Actions Center</h3>

            <div className="grid grid-cols-1 gap-2.5">
              <button 
                onClick={() => onEdit(professor)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition flex items-center justify-between px-4 group/btn"
              >
                <span>Edit Profile parameters</span>
                <ChevronRight size={13} className="text-slate-500 group-hover/btn:translate-x-0.5 transition" />
              </button>

              <button 
                onClick={() => triggerToast("AI Faculty Performance dossier generated.")}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-950/20 to-purple-950/20 hover:from-blue-900/30 hover:to-purple-900/30 border border-blue-500/10 text-xs font-bold text-blue-400 hover:text-white cursor-pointer transition flex items-center justify-between px-4 group/btn"
              >
                <span>Compile AI Performance report</span>
                <Sparkles size={13} className="text-blue-500 group-hover/btn:rotate-12 transition shrink-0" />
              </button>

              <button 
                onClick={() => triggerToast("Direct email log dispatched.")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition flex items-center justify-between px-4 group/btn"
              >
                <span>Email faculty member</span>
                <Mail size={13} className="text-slate-500 group-hover/btn:translate-x-0.5 transition shrink-0" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default FacultyWorkspace;

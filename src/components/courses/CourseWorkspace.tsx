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
  BookOpen,
  Clock,
  FileDown,
  ShieldAlert,
  BarChart3,
  Activity,
  PlayCircle,
  BookMarked,
  Link as LinkIcon,
  ChevronRight,
  Plus,
  MessageSquare,
  Users
} from "lucide-react";
import type { CourseType } from "../../types/course";

interface CourseWorkspaceProps {
  course: CourseType;
  onBack: () => void;
  onEdit: (course: CourseType) => void;
}

function CourseWorkspace({ course, onBack, onEdit }: CourseWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"syllabus" | "performance" | "resources" | "timeline">("syllabus");
  const [toastMessage, setToastMessage] = useState("");

  // Calculate dynamic mock metrics based on course name/code
  const metrics = useMemo(() => {
    const code = course.courseCode.toLowerCase();
    let health = 90;
    let healthLabel = "Excellent Health";
    let healthColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    let completion = 82;
    let studentsCount = 68;
    let riskCount = 2;
    let assignedFaculty = "Dr. Sarah Jenkins";
    let syllabusProgress = 82;
    let aiSummary = "";
    
    let chapters = [
      { num: 1, title: "Foundations & Complexity Analysis", status: "Completed", date: "June 12" },
      { num: 2, title: "Divide & Conquer Paradigm", status: "Completed", date: "June 24" },
      { num: 3, title: "Dynamic Programming Optimizations", status: "Completed", date: "July 08" },
      { num: 4, title: "Greedy Heuristics & Flows", status: "In Progress", date: "Current" },
      { num: 5, title: "NP-Completeness & Approximation Theory", status: "Pending", date: "Future" }
    ];

    let learningOutcomes = [
      "Deconstruct algorithmic complexities using asymptotic notations.",
      "Formulate dynamic programming formulations for structural optimization.",
      "Prove NP-Completeness boundaries for classical decision problems."
    ];

    let difficultChapters = [
      "NP-Completeness proof reductions (Approx 38% class struggle index)",
      "Dynamic programming memoization optimization (Approx 22% struggle index)"
    ];

    if (code.includes("alg") || course.courseName.toLowerCase().includes("algorithm")) {
      aiSummary = "Algorithms syllabus progress is running fully compliant with calendar benchmarks. Overall performance metrics indicate a strong average. However, AI logs flag NP-Completeness reductions as a high-difficulty barrier, showing a predicted 38% class struggle index. Supplemental tutoring scheduled.";
    } else if (code.includes("phy") || course.courseName.toLowerCase().includes("physics")) {
      health = 68;
      healthLabel = "Caution: Schedule Delay";
      healthColor = "text-red-400 border-red-500/20 bg-red-500/5 animate-pulse";
      completion = 58;
      riskCount = 6;
      aiSummary = "Physics syllabus progress is currently 15% behind standard academic schedules due to missed lab slots. Class attendance averages have dropped to 78%. AI predicts performance issues in midterm assessments if not balanced.";
      chapters = [
        { num: 1, title: "Classical Mechanics & Relativity", status: "Completed", date: "June 10" },
        { num: 2, title: "Electromagnetism & Wave Equations", status: "Completed", date: "June 28" },
        { num: 3, title: "Thermodynamics & Heat Cycles", status: "In Progress", date: "Current" },
        { num: 4, title: "Quantum Physics & Wavefunctions", status: "Pending", date: "Future" }
      ];
      difficultChapters = [
        "Quantum mechanics wavefunctions math proofs (48% struggle index predicted)",
        "Relativistic momentum equations conversions (30% struggle index)"
      ];
    } else {
      aiSummary = "Course execution metrics are stable. Syllabus milestones align cleanly with curriculum objectives. No critical attendance risks reported.";
    }

    const timeline = [
      { title: "Lab Sheet IV uploaded", desc: "Dynamic programming assignments verified", date: "3 days ago", icon: <FileText size={14} />, color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
      { title: "Midterm grades locking complete", desc: "Grade distribution approved by Senate", date: "1 week ago", icon: <Award size={14} />, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
      { title: "Syllabus builder locked", desc: "Course curriculum baseline compiled", date: "June 10, 2026", icon: <BookMarked size={14} />, color: "bg-purple-500/10 border-purple-500/20 text-purple-400" }
    ];

    const resources = [
      { name: "Algorithms Core Textbook.pdf", size: "14.2 MB", type: "book" },
      { name: "lecture_recording_DP_memoization.mp4", size: "182 MB", type: "video" },
      { name: "NP_completeness_reductions_guide.pdf", size: "2.4 MB", type: "book" }
    ];

    return { 
      health, 
      healthLabel, 
      healthColor, 
      completion, 
      studentsCount, 
      riskCount, 
      assignedFaculty, 
      syllabusProgress, 
      aiSummary, 
      chapters, 
      learningOutcomes, 
      difficultChapters, 
      timeline, 
      resources 
    };
  }, [course]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="space-y-8 select-none text-slate-100 font-sans">
      
      {/* Toast Popup */}
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
          <span>Back to Curriculum Registry</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-[10px] text-blue-400 font-bold uppercase tracking-wider">
          <Sparkles size={12} className="animate-pulse" />
          <span>Course Intelligence Terminal</span>
        </div>
      </div>

      {/* SECTION 1: Premium Course Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950/60 p-6 md:p-8 backdrop-blur-2xl flex flex-col md:flex-row justify-between gap-6 shadow-xl group">
        <div className="absolute top-0 right-0 w-84 h-84 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:opacity-75 transition duration-500" />
        
        <div className="flex items-start gap-4.5 relative z-10">
          {/* Avatar Icon placeholder */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 border border-emerald-500/35 flex items-center justify-center font-bold text-white text-2xl font-mono shrink-0 shadow-lg">
            {course.courseCode.substring(0, 2)}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{course.courseName}</h2>
            <p className="text-slate-500 text-xs font-semibold font-mono">{course.courseCode} • {course.credits} Credits Weight</p>
            <div className="flex gap-4 text-xs font-semibold text-slate-400 pt-1.5 flex-wrap">
              <span>{course.department}</span>
              <span className="text-slate-700">•</span>
              <span>Semester {course.semester}</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-500 font-medium">Instructor: {metrics.assignedFaculty}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Key metrics highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 md:min-w-[420px]">
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">COMPLETION</p>
            <p className="text-xl font-bold text-white font-mono">{metrics.completion}%</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">STUDENT LOAD</p>
            <p className="text-xl font-bold text-white font-mono">{metrics.studentsCount} Students</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">AI FAIL RISK</p>
            <p className={`text-xl font-bold font-mono ${metrics.riskCount > 3 ? "text-red-400" : "text-emerald-400"}`}>{metrics.riskCount} Students</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">HEALTH SCORE</p>
            <p className="text-xl font-bold text-blue-400 font-mono">{metrics.health}/100</p>
          </div>
        </div>
      </div>

      {/* Main Split Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Summary, Graphs, Chapters trackers */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 2: AI Summary Card */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/60 p-6 backdrop-blur-xl relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-4 select-none">
              <Sparkles size={15} className="text-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">SHIVIL AI Syllabus Summary</h3>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans font-medium">
              {metrics.aiSummary}
            </p>
          </div>

          {/* Tab Selector & Graphics Container */}
          <div className="space-y-5">
            <div className="flex bg-slate-950 border border-white/5 p-1 rounded-2xl gap-1 w-fit select-none">
              <button 
                onClick={() => setActiveTab("syllabus")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-tight transition duration-200 cursor-pointer ${
                  activeTab === "syllabus" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Syllabus Tracker
              </button>
              <button 
                onClick={() => setActiveTab("performance")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-tight transition duration-200 cursor-pointer ${
                  activeTab === "performance" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Grades Distribution
              </button>
              <button 
                onClick={() => setActiveTab("resources")}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold tracking-tight transition duration-200 cursor-pointer ${
                  activeTab === "resources" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Library Resources
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
              
              {/* Syllabus Tracker */}
              {activeTab === "syllabus" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">Course Chapters Progress</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Track units and teaching schedules</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-mono">
                      Completion: {metrics.completion}%
                    </span>
                  </div>

                  <div className="space-y-3">
                    {metrics.chapters.map((chap) => (
                      <div key={chap.num} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900/60 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6.5 h-6.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-400 text-xs font-mono shrink-0">
                            {chap.num}
                          </span>
                          <span className="text-xs font-semibold text-white truncate">{chap.title}</span>
                        </div>
                        <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                          chap.status === "Completed" 
                            ? "bg-green-500/10 border-green-500/20 text-green-400" 
                            : chap.status === "In Progress" 
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse" 
                            : "bg-slate-900 border-slate-800 text-slate-500"
                        }`}>
                          {chap.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Performance Bell Curve */}
              {activeTab === "performance" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-900/60 pb-3">
                    <h4 className="text-sm font-bold text-white">Student Grade Bell Curve</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Projected student marks distributions (Midterms)</p>
                  </div>

                  {/* SVG curves */}
                  <div className="h-44 w-full pt-4">
                    <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                      <line x1="0" y1="20" x2="500" y2="20" stroke="#111827" strokeDasharray="3 3" />
                      <line x1="0" y1="75" x2="500" y2="75" stroke="#111827" strokeDasharray="3 3" />
                      <line x1="0" y1="130" x2="500" y2="130" stroke="#111827" strokeDasharray="3 3" />

                      {/* Bell curve */}
                      <path 
                        d="M 20 130 Q 150 130 250 30 T 480 130" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3.5"
                      />
                      
                      <circle cx="250" cy="30" r="4.5" fill="#10b981" stroke="#030712" strokeWidth="2" />
                      <circle cx="150" cy="90" r="4" fill="#a78bfa" stroke="#030712" strokeWidth="1.5" />
                      <circle cx="350" cy="90" r="4" fill="#ec4899" stroke="#030712" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div className="flex gap-6 text-[10px] font-mono text-slate-500 border-t border-slate-900/60 pt-4">
                    <span>Pass Target: A (12%)</span>
                    <span>Average: B (64%)</span>
                    <span>Failing risk: F ({metrics.riskCount} students)</span>
                  </div>
                </motion.div>
              )}

              {/* Resource catalog */}
              {activeTab === "resources" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="border-b border-slate-900/60 pb-3">
                    <h4 className="text-sm font-bold text-white">Course Library & Video Resources</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Syllabus books, lab manuals, and video lectures</p>
                  </div>

                  <div className="space-y-2.5">
                    {metrics.resources.map((res, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900/60 flex items-center justify-between hover:border-slate-800 transition group/res">
                        <div className="flex items-center gap-3 min-w-0">
                          {res.type === "video" ? (
                            <PlayCircle size={16} className="text-pink-400 shrink-0" />
                          ) : (
                            <FileText size={16} className="text-blue-400 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate leading-none">{res.name}</p>
                            <p className="text-[9px] text-slate-500 mt-1.5 leading-none">{res.size} • Verified Textbook</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => triggerToast(`${res.name} download initiated.`)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white transition shrink-0 cursor-pointer"
                        >
                          <FileDown size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Timeline */}
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

          {/* Chapters and syllabus outcomes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Learning Outcomes */}
            <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/50 space-y-4 shadow-lg">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={14} className="text-blue-400" />
                <span>Learning Outcomes</span>
              </h4>
              <div className="space-y-2.5">
                {metrics.learningOutcomes.map((out, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-[11px] leading-relaxed text-slate-400">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{out}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficult Chapters */}
            <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/50 space-y-4 shadow-lg">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle size={14} className="text-red-400" />
                <span>Difficult Chapters (AI Flagged)</span>
              </h4>
              <div className="space-y-2.5">
                {metrics.difficultChapters.map((chap, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start text-[11px] leading-relaxed text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-2" />
                    <span>{chap}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (4 cols): Action Center, Recommendations */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SECTION 9: AI Suggestions & Alerts */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
              <Sparkles size={15} className="text-purple-400" />
              <span>AI Suggestions & Warnings</span>
            </h3>

            <div className="space-y-3">
              {metrics.health < 80 ? (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-850 transition">
                  <p className="text-[11px] font-bold text-white">Syllabus Catch-up Required</p>
                  <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Syllabus progress lags behind threshold by 15%. Recommend extra lab make-up allocation.</p>
                  <button 
                    onClick={() => triggerToast("Extra lab makeup session scheduled.")}
                    className="mt-3 text-[10px] font-bold text-purple-400 hover:text-white transition cursor-pointer"
                  >
                    Schedule Makeup Session
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-850 transition">
                  <p className="text-[11px] font-bold text-white">Advanced Projects Assignment</p>
                  <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">Syllabus compliance is 82%. Recommend assigning advanced capstone projects to cohort.</p>
                  <button 
                    onClick={() => triggerToast("Capstone project templates dispatched.")}
                    className="mt-3 text-[10px] font-bold text-purple-400 hover:text-white transition cursor-pointer"
                  >
                    Dispatch Capstone Outlines
                  </button>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-850 transition">
                <p className="text-[11px] font-bold text-white">Remedial Exams Setup</p>
                <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">AI flags {metrics.riskCount} students at performance risk. Recommend setting up remedial testing schedules.</p>
                <button 
                  onClick={() => triggerToast("Remedial exams template generated.")}
                  className="mt-3 text-[10px] font-bold text-purple-400 hover:text-white transition cursor-pointer"
                >
                  Generate Test Schedule
                </button>
              </div>
            </div>
          </div>

          {/* SECTION Quick Actions */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white tracking-tight">Quick Actions Center</h3>

            <div className="grid grid-cols-1 gap-2.5">
              <button 
                onClick={() => onEdit(course)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition flex items-center justify-between px-4 group/btn"
              >
                <span>Edit Course Syllabus</span>
                <ChevronRight size={13} className="text-slate-500 group-hover/btn:translate-x-0.5 transition" />
              </button>

              <button 
                onClick={() => triggerToast("Syllabus Dossier PDF exported.")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition flex items-center justify-between px-4 group/btn"
              >
                <span>Export Course Dossier</span>
                <FileDown size={13} className="text-slate-500 group-hover/btn:translate-y-0.5 transition shrink-0" />
              </button>

              <button 
                onClick={() => triggerToast("New announcement dispatched to course students.")}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/5 text-xs font-bold text-slate-300 hover:text-white cursor-pointer transition flex items-center justify-between px-4 group/btn"
              >
                <span>Post Announcement</span>
                <MessageSquare size={13} className="text-slate-500 group-hover/btn:translate-x-0.5 transition shrink-0" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default CourseWorkspace;

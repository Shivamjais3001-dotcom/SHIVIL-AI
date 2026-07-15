import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import {
  ClipboardList, BarChart3, Calendar, FileText,
  Award, Settings2, TrendingUp, TrendingDown,
  Users, CheckCircle2, Clock, AlertTriangle,
  Lock, Star, BookOpen, Layers, GraduationCap,
  Sparkles, ChevronRight, Plus, Filter, Search,
  ShieldCheck, XCircle, RotateCcw, Download,
  Target, Activity, Medal, Zap, ArrowUpRight,
  ArrowDownRight, Eye, Edit3, Check, X
} from "lucide-react";

// ────────────────────────────────────────────────────────────
// MOCK DATA (realistic for demonstration)
// ────────────────────────────────────────────────────────────
const MOCK_METRICS = {
  totalExams: 48,
  upcomingExams: 12,
  completedLockedExams: 31,
  totalMarkRecords: 8640,
  failureCount: 412,
  passRate: "95.2%",
  pendingApprovals: 23,
  pendingReEvaluations: 7
};

const EXAM_TYPES = [
  "MID_SEMESTER", "END_SEMESTER", "QUIZ", "ASSIGNMENT",
  "LAB_EXAM", "PRACTICAL", "VIVA", "PROJECT_EVALUATION",
  "RETEST", "SUPPLEMENTARY"
];

const EXAM_TYPE_LABELS: Record<string, string> = {
  MID_SEMESTER: "Mid Semester", END_SEMESTER: "End Semester",
  QUIZ: "Quiz", ASSIGNMENT: "Assignment", LAB_EXAM: "Lab Exam",
  PRACTICAL: "Practical", VIVA: "Viva", PROJECT_EVALUATION: "Project Eval",
  RETEST: "Retest", SUPPLEMENTARY: "Supplementary"
};

const EXAM_TYPE_COLORS: Record<string, string> = {
  MID_SEMESTER: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  END_SEMESTER: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  QUIZ: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  ASSIGNMENT: "bg-green-500/15 text-green-400 border-green-500/30",
  LAB_EXAM: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  PRACTICAL: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  VIVA: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  PROJECT_EVALUATION: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  RETEST: "bg-red-500/15 text-red-400 border-red-500/30",
  SUPPLEMENTARY: "bg-amber-500/15 text-amber-400 border-amber-500/30"
};

const MOCK_EXAMS = [
  { id: "1", title: "Data Structures Mid Sem", examType: "MID_SEMESTER", subject: { name: "Data Structures", code: "CS301" }, date: "2026-07-25T00:00:00Z", startTime: "09:00", endTime: "12:00", maxMarks: 100, semester: "3", academicYear: "2026-27", approvalStatus: "PENDING", isLocked: false },
  { id: "2", title: "DBMS End Sem", examType: "END_SEMESTER", subject: { name: "Database Systems", code: "CS401" }, date: "2026-07-28T00:00:00Z", startTime: "10:00", endTime: "13:00", maxMarks: 100, semester: "4", academicYear: "2026-27", approvalStatus: "APPROVED", isLocked: false },
  { id: "3", title: "OS Lab Exam", examType: "LAB_EXAM", subject: { name: "Operating Systems", code: "CS501" }, date: "2026-07-20T00:00:00Z", startTime: "14:00", endTime: "17:00", maxMarks: 50, semester: "5", academicYear: "2026-27", approvalStatus: "LOCKED", isLocked: true },
  { id: "4", title: "ML Project Evaluation", examType: "PROJECT_EVALUATION", subject: { name: "Machine Learning", code: "CS601" }, date: "2026-08-05T00:00:00Z", startTime: "09:00", endTime: "17:00", maxMarks: 100, semester: "6", academicYear: "2026-27", approvalStatus: "PENDING", isLocked: false },
  { id: "5", title: "Networks Viva", examType: "VIVA", subject: { name: "Computer Networks", code: "CS404" }, date: "2026-07-22T00:00:00Z", startTime: "11:00", endTime: "14:00", maxMarks: 25, semester: "4", academicYear: "2026-27", approvalStatus: "SUBMITTED", isLocked: false },
  { id: "6", title: "Algorithms Supplementary", examType: "SUPPLEMENTARY", subject: { name: "Design Algorithms", code: "CS302" }, date: "2026-08-10T00:00:00Z", startTime: "09:00", endTime: "12:00", maxMarks: 100, semester: "3", academicYear: "2026-27", approvalStatus: "PENDING", isLocked: false }
];

const MOCK_TOP_PERFORMERS = [
  { rank: 1, name: "Priya Patel", rollNo: "CS2024001", branch: "CSE", cgpa: 9.8, sgpa: 9.9 },
  { rank: 2, name: "Rahul Sharma", rollNo: "CS2024002", branch: "CSE", cgpa: 9.6, sgpa: 9.7 },
  { rank: 3, name: "Ananya Singh", rollNo: "EC2024001", branch: "ECE", cgpa: 9.5, sgpa: 9.8 },
  { rank: 4, name: "Kabir Mehta", rollNo: "ME2024001", branch: "MECH", cgpa: 9.3, sgpa: 9.4 },
  { rank: 5, name: "Sneha Reddy", rollNo: "CS2024003", branch: "CSE", cgpa: 9.2, sgpa: 9.1 }
];

const MOCK_DEPT_COMPARISON = [
  { department: "CSE", totalStudents: 120, avgCGPA: "8.42", backlogCount: 5, backlogRate: "4.2%" },
  { department: "ECE", totalStudents: 90, avgCGPA: "7.91", backlogCount: 8, backlogRate: "8.9%" },
  { department: "MECH", totalStudents: 75, avgCGPA: "7.64", backlogCount: 11, backlogRate: "14.7%" },
  { department: "CIVIL", totalStudents: 60, avgCGPA: "7.82", backlogCount: 6, backlogRate: "10.0%" },
  { department: "EE", totalStudents: 50, avgCGPA: "8.10", backlogCount: 3, backlogRate: "6.0%" }
];

const MOCK_CGPA_DIST = [
  { range: "9.0 - 10.0", count: 28 }, { range: "8.0 - 8.9", count: 64 },
  { range: "7.0 - 7.9", count: 112 }, { range: "6.0 - 6.9", count: 89 },
  { range: "5.0 - 5.9", count: 44 }, { range: "< 5.0", count: 18 }
];

const MOCK_SUBJECT_DIFFICULTY = [
  { subjectCode: "CS501", subjectName: "Operating Systems", passRate: "62.4%", avgMarks: "51.2", difficultyLevel: "HIGH" },
  { subjectCode: "CS302", subjectName: "Design Algorithms", passRate: "67.8%", avgMarks: "54.1", difficultyLevel: "HIGH" },
  { subjectCode: "CS601", subjectName: "Machine Learning", passRate: "74.3%", avgMarks: "61.8", difficultyLevel: "HIGH" },
  { subjectCode: "CS301", subjectName: "Data Structures", passRate: "84.2%", avgMarks: "71.4", difficultyLevel: "LOW" },
  { subjectCode: "CS401", subjectName: "Database Systems", passRate: "88.6%", avgMarks: "76.2", difficultyLevel: "LOW" }
];

const MOCK_MARKS = [
  { id: "m1", student: { name: "Priya Patel", rollNo: "CS2024001" }, totalMarks: 94, grade: "O", gradePoint: 10, approvalStatus: "APPROVED" },
  { id: "m2", student: { name: "Rahul Sharma", rollNo: "CS2024002" }, totalMarks: 87, grade: "A+", gradePoint: 9, approvalStatus: "SUBMITTED" },
  { id: "m3", student: { name: "Neha Reddy", rollNo: "CS2024003" }, totalMarks: 43, grade: "P", gradePoint: 4, approvalStatus: "PENDING" },
  { id: "m4", student: { name: "Rohan Gupta", rollNo: "CS2024004" }, totalMarks: 72, grade: "B+", gradePoint: 7, approvalStatus: "APPROVED" },
  { id: "m5", student: { name: "Anya Sen", rollNo: "CS2024005" }, totalMarks: 35, grade: "F", gradePoint: 0, approvalStatus: "SUBMITTED" }
];

const MOCK_RESULTS = [
  { id: "r1", student: { name: "Priya Patel", rollNo: "CS2024001", branch: "CSE" }, semester: "6", academicYear: "2026-27", sgpa: 9.8, cgpa: 9.6, creditsEarned: 24, backlogsCount: 0, resultStatus: "PROMOTED" },
  { id: "r2", student: { name: "Rahul Sharma", rollNo: "CS2024002", branch: "CSE" }, semester: "6", academicYear: "2026-27", sgpa: 9.2, cgpa: 9.1, creditsEarned: 24, backlogsCount: 0, resultStatus: "ELIGIBLE_FOR_GRADUATION" },
  { id: "r3", student: { name: "Neha Reddy", rollNo: "CS2024003", branch: "CSE" }, semester: "6", academicYear: "2026-27", sgpa: 4.1, cgpa: 5.2, creditsEarned: 18, backlogsCount: 3, resultStatus: "BACKLOG" },
  { id: "r4", student: { name: "Rohan Gupta", rollNo: "CS2024004", branch: "CSE" }, semester: "6", academicYear: "2026-27", sgpa: 7.8, cgpa: 7.5, creditsEarned: 24, backlogsCount: 0, resultStatus: "PROMOTED" },
  { id: "r5", student: { name: "Anya Sen", rollNo: "CS2024005", branch: "CSE" }, semester: "6", academicYear: "2026-27", sgpa: 3.2, cgpa: 4.1, creditsEarned: 16, backlogsCount: 5, resultStatus: "DETAINED" }
];

// ────────────────────────────────────────────────────────────
// COMPONENT HELPERS
// ────────────────────────────────────────────────────────────
function MetricCard({
  label, value, icon: Icon, trend, trendValue, color = "blue", sub
}: {
  label: string; value: string | number; icon: any;
  trend?: "up" | "down" | "neutral"; trendValue?: string;
  color?: string; sub?: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; glow: string; border: string }> = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", glow: "shadow-blue-500/20", border: "border-blue-500/20" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", glow: "shadow-purple-500/20", border: "border-purple-500/20" },
    green: { bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "shadow-emerald-500/20", border: "border-emerald-500/20" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", glow: "shadow-amber-500/20", border: "border-amber-500/20" },
    red: { bg: "bg-red-500/10", text: "text-red-400", glow: "shadow-red-500/20", border: "border-red-500/20" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", glow: "shadow-cyan-500/20", border: "border-cyan-500/20" }
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={`relative group rounded-2xl border ${c.border} bg-slate-950/60 backdrop-blur-sm p-5 hover:shadow-lg ${c.glow} transition-all duration-300 hover:-translate-y-0.5 overflow-hidden`}>
      <div className={`absolute inset-0 ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
            <Icon size={18} className={c.text} />
          </div>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
              trend === "up" ? "bg-emerald-500/10 text-emerald-400" :
              trend === "down" ? "bg-red-500/10 text-red-400" :
              "bg-slate-500/10 text-slate-400"
            }`}>
              {trend === "up" ? <ArrowUpRight size={10} /> : trend === "down" ? <ArrowDownRight size={10} /> : null}
              {trendValue}
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
        {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function ExamTypeBadge({ type }: { type: string }) {
  const color = EXAM_TYPE_COLORS[type] || "bg-slate-500/15 text-slate-400 border-slate-500/30";
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>
      {EXAM_TYPE_LABELS[type] || type}
    </span>
  );
}

function ApprovalBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    SUBMITTED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    UNDER_REVIEW: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    APPROVED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    REJECTED: "bg-red-500/15 text-red-400 border-red-500/30",
    LOCKED: "bg-purple-500/15 text-purple-400 border-purple-500/30"
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${map[status] || map.PENDING}`}>
      {status}
    </span>
  );
}

function ResultStatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; label: string }> = {
    PROMOTED: { color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", label: "Promoted" },
    BACKLOG: { color: "bg-amber-500/15 text-amber-400 border-amber-500/30", label: "Backlog" },
    DETAINED: { color: "bg-red-500/15 text-red-400 border-red-500/30", label: "Detained" },
    GRADUATED: { color: "bg-blue-500/15 text-blue-400 border-blue-500/30", label: "Graduated" },
    ELIGIBLE_FOR_GRADUATION: { color: "bg-purple-500/15 text-purple-400 border-purple-500/30", label: "Grad Eligible" },
    PROCESSING: { color: "bg-slate-500/15 text-slate-400 border-slate-500/30", label: "Processing" }
  };
  const item = map[status] || map.PROCESSING;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.color}`}>
      {item.label}
    </span>
  );
}

// Donut chart mock
function DonutChart({ passRate }: { passRate: string }) {
  const pct = parseFloat(passRate);
  const r = 45, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="12" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="url(#donutGrad)" strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        <defs>
          <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-bold text-white">{passRate}</p>
        <p className="text-[9px] text-slate-500">Pass Rate</p>
      </div>
    </div>
  );
}

// Bar chart for CGPA distribution
function CGPABar({ range, count, max }: { range: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-[10px] text-slate-500 w-24 shrink-0">{range}</span>
      <div className="flex-1 h-5 bg-slate-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-700 group-hover:from-blue-500 group-hover:to-purple-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-white w-6 text-right">{count}</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// TABS
// ────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "schedule", label: "Exam Schedule", icon: Calendar },
  { id: "marks", label: "Marks Entry", icon: Edit3 },
  { id: "results", label: "Results", icon: GraduationCap },
  { id: "grading", label: "Grading Policy", icon: Settings2 },
  { id: "transcripts", label: "Transcripts", icon: FileText }
];

// ────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────
export default function Examination() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filteredExams = useMemo(() => {
    return MOCK_EXAMS.filter(e => {
      const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.subject.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === "All" || e.examType === filterType;
      return matchSearch && matchType;
    });
  }, [searchQuery, filterType]);

  const maxCGPACount = Math.max(...MOCK_CGPA_DIST.map(d => d.count));

  return (
    <div className="flex min-h-screen bg-[#050814]">
      <Sidebar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl text-sm font-medium animate-slide-in shadow-2xl ${
          toast.type === "success"
            ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-300"
            : "bg-red-950/80 border-red-500/30 text-red-300"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {toast.msg}
        </div>
      )}

      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                <ClipboardList size={15} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Examination Intelligence
              </h1>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-semibold">
                <Sparkles size={9} />
                Sprint 8
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Enterprise Assessment & Result Processing Engine · Multi-tenant · AI-Ready
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-semibold transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            <Plus size={13} />
            Schedule Exam
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950/60 border border-slate-900 w-fit overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/60"
                }`}
              >
                <Icon size={13} className={isActive ? "text-blue-400" : ""} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── TAB: DASHBOARD ─────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Total Exams" value={MOCK_METRICS.totalExams} icon={ClipboardList} color="blue" trend="up" trendValue="+8" sub="This semester" />
              <MetricCard label="Upcoming Exams" value={MOCK_METRICS.upcomingExams} icon={Calendar} color="cyan" trend="neutral" trendValue="next 30d" />
              <MetricCard label="Pending Approvals" value={MOCK_METRICS.pendingApprovals} icon={Clock} color="amber" trend="down" trendValue="-5 today" />
              <MetricCard label="Re-eval Requests" value={MOCK_METRICS.pendingReEvaluations} icon={RotateCcw} color="red" />
              <MetricCard label="Total Mark Records" value={MOCK_METRICS.totalMarkRecords.toLocaleString()} icon={FileText} color="purple" trend="up" trendValue="+1.2k" />
              <MetricCard label="Locked Exams" value={MOCK_METRICS.completedLockedExams} icon={Lock} color="green" sub="Results finalized" />
              <MetricCard label="Failure Count" value={MOCK_METRICS.failureCount} icon={AlertTriangle} color="red" sub="Needs attention" />
              <MetricCard label="Overall Pass Rate" value={MOCK_METRICS.passRate} icon={TrendingUp} color="green" trend="up" trendValue="+1.2%" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Pass Rate Donut */}
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-blue-400" />
                  Pass / Fail Rate
                </h3>
                <div className="flex items-center gap-6">
                  <DonutChart passRate={MOCK_METRICS.passRate} />
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                        <span className="text-xs text-slate-400">Passed</span>
                      </div>
                      <span className="text-xs font-bold text-white">8,228</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span className="text-xs text-slate-400">Failed</span>
                      </div>
                      <span className="text-xs font-bold text-red-400">412</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-[10px] text-slate-500">Total evaluated: 8,640</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CGPA Distribution */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 size={14} className="text-violet-400" />
                  CGPA Distribution
                </h3>
                <div className="space-y-2.5">
                  {MOCK_CGPA_DIST.map(d => (
                    <CGPABar key={d.range} range={d.range} count={d.count} max={maxCGPACount} />
                  ))}
                </div>
              </div>
            </div>

            {/* Two columns: Department + Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Department Comparison */}
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Layers size={14} className="text-cyan-400" />
                  Department Comparison
                </h3>
                <div className="space-y-2">
                  {MOCK_DEPT_COMPARISON.map((dept, i) => (
                    <div key={dept.department} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/60 transition-colors group">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600/30 to-violet-600/30 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{dept.department}</span>
                          <span className="text-xs font-bold text-white">{dept.avgCGPA}</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[10px] text-slate-500">{dept.totalStudents} students</span>
                          <span className={`text-[10px] font-medium ${parseFloat(dept.backlogRate) > 10 ? "text-red-400" : "text-emerald-400"}`}>
                            {dept.backlogRate} backlog
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performers */}
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Medal size={14} className="text-amber-400" />
                  Top Performers
                </h3>
                <div className="space-y-2">
                  {MOCK_TOP_PERFORMERS.map((s, i) => (
                    <div key={s.rollNo} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/60 transition-colors group">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                        i === 0 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                        i === 1 ? "bg-slate-400/20 text-slate-400 border border-slate-400/30" :
                        i === 2 ? "bg-orange-600/20 text-orange-500 border border-orange-500/30" :
                        "bg-slate-900 text-slate-500 border border-slate-800"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{s.name}</span>
                          <span className="text-xs font-bold text-emerald-400">{s.cgpa} CGPA</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[10px] text-slate-500">{s.rollNo} · {s.branch}</span>
                          <span className="text-[10px] text-slate-500">SGPA {s.sgpa}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subject Difficulty */}
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Target size={14} className="text-red-400" />
                Subject Difficulty Index
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800/60">
                      <th className="text-left pb-3 font-medium">Subject</th>
                      <th className="text-left pb-3 font-medium">Code</th>
                      <th className="text-right pb-3 font-medium">Avg Marks</th>
                      <th className="text-right pb-3 font-medium">Pass Rate</th>
                      <th className="text-right pb-3 font-medium">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {MOCK_SUBJECT_DIFFICULTY.map(s => (
                      <tr key={s.subjectCode} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-2.5 font-medium text-white">{s.subjectName}</td>
                        <td className="py-2.5 text-slate-500">{s.subjectCode}</td>
                        <td className="py-2.5 text-right text-slate-300">{s.avgMarks}</td>
                        <td className="py-2.5 text-right">
                          <span className={parseFloat(s.passRate) < 70 ? "text-red-400" : "text-emerald-400"}>
                            {s.passRate}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            s.difficultyLevel === "HIGH"
                              ? "bg-red-500/15 text-red-400 border-red-500/30"
                              : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          }`}>
                            {s.difficultyLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: EXAM SCHEDULE ─────────────────────────── */}
        {activeTab === "schedule" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search exams..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 w-56"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={12} className="text-slate-500" />
                {["All", "MID_SEMESTER", "END_SEMESTER", "QUIZ", "LAB_EXAM", "VIVA"].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
                      filterType === t
                        ? "bg-blue-600/20 border border-blue-500/30 text-blue-300"
                        : "text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-800"
                    }`}
                  >
                    {t === "All" ? "All Types" : EXAM_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredExams.map(exam => (
                <div
                  key={exam.id}
                  onClick={() => setSelectedExam(exam)}
                  className="group rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm p-5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <ExamTypeBadge type={exam.examType} />
                      <h4 className="text-sm font-semibold text-white mt-2 group-hover:text-blue-300 transition-colors">
                        {exam.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {exam.subject.code} · {exam.subject.name}
                      </p>
                    </div>
                    {exam.isLocked && (
                      <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Lock size={11} className="text-purple-400" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={10} />
                      {new Date(exam.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      <span className="text-slate-700">·</span>
                      {exam.startTime} – {exam.endTime}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={10} />
                      Sem {exam.semester} · {exam.academicYear} · Max {exam.maxMarks} marks
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60">
                    <ApprovalBadge status={exam.approvalStatus} />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={e => { e.stopPropagation(); showToast(`Viewing ${exam.title}`); }}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-blue-400 transition-colors"
                      >
                        <Eye size={11} />
                      </button>
                      {!exam.isLocked && (
                        <>
                          <button
                            onClick={e => { e.stopPropagation(); showToast("Edit mode activated"); }}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-amber-400 transition-colors"
                          >
                            <Edit3 size={11} />
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); showToast(`${exam.title} locked successfully`); }}
                            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-purple-400 transition-colors"
                          >
                            <Lock size={11} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredExams.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                  <Calendar size={20} className="text-slate-600" />
                </div>
                <p className="text-sm font-medium text-slate-400">No exams found</p>
                <p className="text-xs text-slate-600 mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: MARKS ENTRY ───────────────────────────── */}
        {activeTab === "marks" && (
          <div className="space-y-4">
            {/* Pending Approvals Banner */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Clock size={14} className="text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-300">
                  {MOCK_METRICS.pendingApprovals} mark records pending approval
                </p>
                <p className="text-[10px] text-amber-500/70 mt-0.5">
                  Submitted by faculty, awaiting HOD/Exam Controller review
                </p>
              </div>
              <button className="ml-auto text-[10px] font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                Review All <ChevronRight size={10} />
              </button>
            </div>

            {/* Select Exam Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Marks Entry — Data Structures Mid Semester</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast("Bulk CSV upload initiated")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs transition-colors"
                >
                  <Download size={11} />
                  Bulk Upload
                </button>
                <button
                  onClick={() => showToast("Marks submitted for approval")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 text-xs transition-colors"
                >
                  <ShieldCheck size={11} />
                  Submit for Approval
                </button>
              </div>
            </div>

            {/* Marks Table */}
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800/60 bg-slate-900/40">
                      <th className="text-left px-5 py-3 font-semibold text-slate-400">Student</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-400">Roll No</th>
                      <th className="text-right px-3 py-3 font-semibold text-slate-400">Internal</th>
                      <th className="text-right px-3 py-3 font-semibold text-slate-400">External</th>
                      <th className="text-right px-3 py-3 font-semibold text-slate-400">Total</th>
                      <th className="text-center px-3 py-3 font-semibold text-slate-400">Grade</th>
                      <th className="text-center px-3 py-3 font-semibold text-slate-400">Status</th>
                      <th className="text-center px-3 py-3 font-semibold text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {MOCK_MARKS.map(m => (
                      <tr key={m.id} className="hover:bg-slate-900/30 transition-colors group">
                        <td className="px-5 py-3 font-medium text-white">{m.student.name}</td>
                        <td className="px-3 py-3 text-slate-500 font-mono">{m.student.rollNo}</td>
                        <td className="px-3 py-3 text-right">
                          <input
                            type="number"
                            defaultValue={m.totalMarks * 0.3}
                            className="w-16 text-right bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white focus:border-blue-500/50 focus:outline-none"
                          />
                        </td>
                        <td className="px-3 py-3 text-right">
                          <input
                            type="number"
                            defaultValue={m.totalMarks * 0.7}
                            className="w-16 text-right bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white focus:border-blue-500/50 focus:outline-none"
                          />
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-white">{m.totalMarks}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={`font-bold px-2 py-0.5 rounded-lg text-[11px] ${
                            m.grade === "O" ? "text-emerald-400 bg-emerald-500/10" :
                            m.grade === "A+" || m.grade === "A" ? "text-blue-400 bg-blue-500/10" :
                            m.grade === "B+" || m.grade === "B" ? "text-violet-400 bg-violet-500/10" :
                            m.grade === "P" ? "text-amber-400 bg-amber-500/10" :
                            "text-red-400 bg-red-500/10"
                          }`}>
                            {m.grade} ({m.gradePoint})
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <ApprovalBadge status={m.approvalStatus} />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {m.approvalStatus === "SUBMITTED" && (
                              <>
                                <button onClick={() => showToast(`Marks approved for ${m.student.name}`)} className="p-1 rounded-lg hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 transition-colors">
                                  <Check size={11} />
                                </button>
                                <button onClick={() => showToast(`Marks rejected for ${m.student.name}`, "error")} className="p-1 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors">
                                  <X size={11} />
                                </button>
                              </>
                            )}
                            <button className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-blue-400 transition-colors">
                              <Eye size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Grade Legend */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <span className="text-[10px] font-semibold text-slate-500">GRADE SCALE:</span>
              {[["O", "≥90", "emerald"], ["A+", "≥80", "blue"], ["A", "≥70", "blue"], ["B+", "≥60", "violet"], ["B", "≥55", "violet"], ["P", "≥40", "amber"], ["F", "<40", "red"]].map(([g, r, c]) => (
                <div key={g} className="flex items-center gap-1">
                  <span className={`font-bold text-[10px] text-${c}-400`}>{g}</span>
                  <span className="text-[9px] text-slate-600">{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB: RESULTS ───────────────────────────────── */}
        {activeTab === "results" && (
          <div className="space-y-4">
            {/* Batch Processing Banner */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-500/5 to-violet-500/5 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Zap size={14} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Batch Result Processing</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Process SGPA/CGPA for all students — Semester 6 · 2026-27
                  </p>
                </div>
              </div>
              <button
                onClick={() => showToast("Batch result processing initiated. 395 students queued.")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-semibold transition-all"
              >
                <Zap size={12} />
                Process All Results
              </button>
            </div>

            {/* Results Table */}
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800/60 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Semester Results — Sem 6 · 2026-27</h3>
                <span className="text-[10px] text-slate-500">{MOCK_RESULTS.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-800/60 bg-slate-900/40">
                      <th className="text-left px-5 py-3 font-semibold text-slate-400">Student</th>
                      <th className="text-left px-3 py-3 font-semibold text-slate-400">Branch</th>
                      <th className="text-right px-3 py-3 font-semibold text-slate-400">SGPA</th>
                      <th className="text-right px-3 py-3 font-semibold text-slate-400">CGPA</th>
                      <th className="text-right px-3 py-3 font-semibold text-slate-400">Credits</th>
                      <th className="text-center px-3 py-3 font-semibold text-slate-400">Backlogs</th>
                      <th className="text-center px-3 py-3 font-semibold text-slate-400">Status</th>
                      <th className="text-center px-3 py-3 font-semibold text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {MOCK_RESULTS.map(r => (
                      <tr key={r.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-white">{r.student.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{r.student.rollNo}</p>
                        </td>
                        <td className="px-3 py-3 text-slate-400">{r.student.branch}</td>
                        <td className="px-3 py-3 text-right font-bold text-white">{r.sgpa.toFixed(2)}</td>
                        <td className="px-3 py-3 text-right">
                          <span className={`font-bold ${
                            r.cgpa >= 9 ? "text-emerald-400" :
                            r.cgpa >= 7 ? "text-blue-400" :
                            r.cgpa >= 5 ? "text-amber-400" : "text-red-400"
                          }`}>
                            {r.cgpa.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right text-slate-300">{r.creditsEarned}</td>
                        <td className="px-3 py-3 text-center">
                          {r.backlogsCount > 0 ? (
                            <span className="font-bold text-red-400">{r.backlogsCount}</span>
                          ) : (
                            <Check size={12} className="text-emerald-400 mx-auto" />
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <ResultStatusBadge status={r.resultStatus} />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => showToast(`Transcript for ${r.student.name} generated`)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors text-[10px] mx-auto"
                          >
                            <FileText size={9} />
                            Transcript
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Backlog Warning */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={13} className="text-red-400" />
                <h4 className="text-xs font-semibold text-red-300">Backlog & Detention Alerts</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-xl font-bold text-red-400">2</p>
                  <p className="text-[10px] text-red-500/70 mt-0.5">Detained</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xl font-bold text-amber-400">1</p>
                  <p className="text-[10px] text-amber-500/70 mt-0.5">Backlog</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xl font-bold text-purple-400">1</p>
                  <p className="text-[10px] text-purple-500/70 mt-0.5">Grad Eligible</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: GRADING POLICY ────────────────────────── */}
        {activeTab === "grading" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Grade Boundary Config */}
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings2 size={14} className="text-violet-400" />
                  Grade Boundaries (10-Point Scale)
                </h3>
                <div className="space-y-2">
                  {[
                    { grade: "O", threshold: 90, points: 10, color: "emerald" },
                    { grade: "A+", threshold: 80, points: 9, color: "blue" },
                    { grade: "A", threshold: 70, points: 8, color: "blue" },
                    { grade: "B+", threshold: 60, points: 7, color: "violet" },
                    { grade: "B", threshold: 55, points: 6, color: "violet" },
                    { grade: "C", threshold: 50, points: 5, color: "amber" },
                    { grade: "P", threshold: 40, points: 4, color: "amber" },
                    { grade: "F", threshold: 0, points: 0, color: "red" }
                  ].map(g => (
                    <div key={g.grade} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/40 transition-colors">
                      <span className={`w-8 text-center font-bold text-sm text-${g.color}-400`}>{g.grade}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-[10px] text-slate-500">≥</span>
                        <input
                          type="number"
                          defaultValue={g.threshold}
                          className="w-16 text-center bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-xs focus:border-blue-500/50 focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-500">%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">GP:</span>
                        <span className="text-xs font-bold text-white">{g.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => showToast("Grading policy updated successfully")}
                  className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/30 text-violet-300 hover:from-violet-600/30 hover:to-blue-600/30 text-xs font-semibold transition-all"
                >
                  Save Grading Policy
                </button>
              </div>

              {/* Promotion & Graduation Rules */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp size={14} className="text-green-400" />
                    Promotion Rules
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
                      <div>
                        <p className="text-xs font-medium text-white">Minimum CGPA</p>
                        <p className="text-[10px] text-slate-500">Required for promotion</p>
                      </div>
                      <input type="number" step="0.1" defaultValue="4.0" className="w-20 text-right bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-sm font-bold focus:border-blue-500/50 focus:outline-none" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
                      <div>
                        <p className="text-xs font-medium text-white">Max Backlogs Allowed</p>
                        <p className="text-[10px] text-slate-500">For promotion eligibility</p>
                      </div>
                      <input type="number" defaultValue="3" className="w-20 text-right bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-sm font-bold focus:border-blue-500/50 focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm p-5">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <GraduationCap size={14} className="text-amber-400" />
                    Graduation Requirements
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
                      <div>
                        <p className="text-xs font-medium text-white">Min Credits Required</p>
                        <p className="text-[10px] text-slate-500">Total for degree completion</p>
                      </div>
                      <input type="number" defaultValue="120" className="w-20 text-right bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-sm font-bold focus:border-blue-500/50 focus:outline-none" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
                      <div>
                        <p className="text-xs font-medium text-white">Min CGPA for Graduation</p>
                        <p className="text-[10px] text-slate-500">Minimum cumulative GPA</p>
                      </div>
                      <input type="number" step="0.1" defaultValue="5.0" className="w-20 text-right bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-white text-sm font-bold focus:border-blue-500/50 focus:outline-none" />
                    </div>
                  </div>
                </div>

                {/* Grade Simulate */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-400" />
                    Grade Simulator
                  </h3>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Marks" max="100" className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500/50 focus:outline-none" />
                    <span className="text-slate-500 text-xs">/ 100</span>
                    <button
                      onClick={() => showToast("Simulated: 87/100 → Grade: A+ (9 points)")}
                      className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold transition-all"
                    >
                      Simulate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: TRANSCRIPTS ───────────────────────────── */}
        {activeTab === "transcripts" && (
          <div className="space-y-4">
            {/* Search Student */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  placeholder="Search student by name or roll number..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs transition-colors">
                <Filter size={11} />
                Filter by Batch
              </button>
            </div>

            {/* Transcript Preview */}
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 backdrop-blur-sm overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-slate-800/60 bg-gradient-to-r from-blue-500/5 to-violet-500/5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-sm font-bold text-white">P</div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Priya Patel</h3>
                        <p className="text-[10px] text-slate-500">CS2024001 · B.Tech Computer Science · 2020-2024</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast("Transcript downloaded as PDF")}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-semibold transition-all"
                    >
                      <Download size={12} />
                      Download Transcript
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                    <p className="text-lg font-bold text-emerald-400">9.6</p>
                    <p className="text-[10px] text-slate-500">CGPA</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                    <p className="text-lg font-bold text-white">142</p>
                    <p className="text-[10px] text-slate-500">Credits Earned</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                    <p className="text-lg font-bold text-white">0</p>
                    <p className="text-[10px] text-slate-500">Backlogs</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-emerald-900/20 border border-emerald-500/20">
                    <p className="text-[10px] font-bold text-emerald-400 mt-1">GRAD ELIGIBLE</p>
                    <p className="text-[10px] text-emerald-500/70">All criteria met</p>
                  </div>
                </div>
              </div>

              {/* Semester-wise Table */}
              <div className="p-5">
                <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Semester-wise Performance</h4>
                <div className="space-y-2">
                  {[
                    { sem: "1", year: "2020-21", sgpa: 9.2, credits: 24, status: "PROMOTED" },
                    { sem: "2", year: "2020-21", sgpa: 9.4, credits: 22, status: "PROMOTED" },
                    { sem: "3", year: "2021-22", sgpa: 9.6, credits: 24, status: "PROMOTED" },
                    { sem: "4", year: "2021-22", sgpa: 9.7, credits: 24, status: "PROMOTED" },
                    { sem: "5", year: "2022-23", sgpa: 9.8, credits: 24, status: "PROMOTED" },
                    { sem: "6", year: "2022-23", sgpa: 9.8, credits: 24, status: "ELIGIBLE_FOR_GRADUATION" }
                  ].map(s => (
                    <div key={s.sem} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-900/40 transition-colors">
                      <div className="w-12 text-center text-xs font-bold text-slate-500">Sem {s.sem}</div>
                      <div className="text-[10px] text-slate-600 w-20">{s.year}</div>
                      <div className="flex-1 h-1.5 bg-slate-900 rounded-full">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full" style={{ width: `${(s.sgpa / 10) * 100}%` }} />
                      </div>
                      <span className="font-bold text-white text-xs w-8 text-right">{s.sgpa}</span>
                      <span className="text-[10px] text-slate-500 w-16 text-right">{s.credits} cr</span>
                      <ResultStatusBadge status={s.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#080d1a] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ClipboardList size={14} className="text-blue-400" />
                Schedule New Examination
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Exam Title</label>
                <input placeholder="e.g., Data Structures Mid Semester 2026" className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500/50 focus:outline-none placeholder-slate-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Exam Type</label>
                  <select className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500/50 focus:outline-none">
                    {EXAM_TYPES.map(t => <option key={t} value={t}>{EXAM_TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Semester</label>
                  <select className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500/50 focus:outline-none">
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Date</label>
                  <input type="date" className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Start</label>
                  <input type="time" className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">End</label>
                  <input type="time" className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500/50 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Max Marks</label>
                  <input type="number" defaultValue={100} className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500/50 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Passing Marks</label>
                  <input type="number" defaultValue={40} className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-blue-500/50 focus:outline-none" />
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <AlertTriangle size={11} className="text-blue-400 shrink-0" />
                <p className="text-[10px] text-blue-400">Conflict detection runs automatically when venue is assigned.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors">
                Cancel
              </button>
              <button
                onClick={() => { setShowCreateModal(false); showToast("Exam scheduled successfully! Conflict check passed."); }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs font-semibold transition-all shadow-lg shadow-blue-500/20"
              >
                Schedule Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

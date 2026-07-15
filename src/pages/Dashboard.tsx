import { useMemo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  AlertCircle
} from "lucide-react";

import StatCard from "../components/ui/StatCard";
import InsightCard from "../components/ui/InsightCard";
import RecentActivity from "../components/ui/RecentActivity";
import { dashboardService, type DashboardStats } from "../services/dashboardService";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const activeRole = localStorage.getItem("userRole") || "Admin";
  const activeName = localStorage.getItem("adminName") || "Shivam Jaiswal";

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
          icon: <Calendar size={20} />,
          subtitle: "Required threshold (>75%)",
          trend: "Compliant"
        },
        {
          title: "Enrolled Courses",
          value: "6 Subjects",
          icon: <BookOpen size={20} />,
          subtitle: "Current semester III",
          trend: "Active"
        },
        {
          title: "Credits Weight",
          value: "24 Credits",
          icon: <GraduationCap size={20} />,
          subtitle: "Earned academic weight",
          trend: "Target: 22"
        },
        {
          title: "Pending Invoices",
          value: "$0.00",
          icon: <CreditCard size={20} />,
          subtitle: "Mess & tuition cleared",
          trend: "Paid"
        }
      ];
    }

    return [
      {
        title: "Active Students",
        value: loading ? "--" : stats?.activeStudents.toString() || "0",
        icon: <Users size={20} />,
        subtitle: "Total registered profiles",
        trend: "+12%"
      },
      {
        title: "Teaching Faculty",
        value: loading ? "--" : stats?.activeFaculty.toString() || "0",
        icon: <GraduationCap size={20} />,
        subtitle: "Total active professors",
        trend: "+5%"
      },
      {
        title: "Active Courses",
        value: loading ? "--" : stats?.totalCourses.toString() || "0",
        icon: <BookOpen size={20} />,
        subtitle: "Curriculum electives",
        trend: "Aligned"
      },
      {
        title: "Average Attendance",
        value: loading ? "--" : stats?.averageAttendance || "0%",
        icon: <Calendar size={20} />,
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
          desc: "Pay messing bills",
          path: "/fees",
          icon: <CreditCard size={18} />
        },
        {
          title: "Library Catalog",
          desc: "Reserve study books",
          path: "/library",
          icon: <BookOpen size={18} />
        },
        {
          title: "Mess & Hostel",
          desc: "mess menu and warden info",
          path: "/hostel",
          icon: <Home size={18} />
        },
        {
          title: "AI Help Terminal",
          desc: "Ask syllabus queries",
          path: "/assistant",
          icon: <Bot size={18} />
        }
      ];
    }

    return [
      {
        title: "Add Student",
        desc: "Register record",
        path: "/students",
        icon: <UserPlus size={18} />
      },
      {
        title: "Add Faculty",
        desc: "Register profile",
        path: "/faculty",
        icon: <GraduationCap size={18} />
      },
      {
        title: "New Course",
        desc: "Manage syllabus",
        path: "/courses",
        icon: <FilePlus size={18} />
      },
      {
        title: "Reports Log",
        desc: "Export metrics",
        path: "/reports",
        icon: <BarChart3 size={18} />
      }
    ];
  }, [activeRole]);

  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />

      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-3xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0 animate-pulse" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Welcome back, {activeName} 👋
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {activeRole === "Student" 
                  ? "Here is your academic progress terminal dashboard for this semester." 
                  : "Here is the operational overview for Shivil University today."}
              </p>
            </div>
            
            {/* AI Status Badge */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-xs text-blue-400 font-semibold self-start md:self-auto">
              <Sparkles size={14} className="animate-pulse" />
              <span>
                {activeRole === "Student" 
                  ? "AI Study Advisor: Connected" 
                  : "AI Auditor: Online & Active"}
              </span>
            </div>
          </div>

          {/* Stats cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsList.map((stat, idx) => (
              <StatCard
                key={idx}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                subtitle={stat.subtitle}
                trend={stat.trend}
              />
            ))}
          </div>

          {/* Central Grid: Analytics & Side items */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Academic Growth Graph */}
            <div className="lg:col-span-8 rounded-3xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {activeRole === "Student" ? "My Grading Curves" : "Operational Activity Curve"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeRole === "Student" ? "GPA logs over past 3 semesters" : "Hourly student check-ins and ledger updates"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp size={12} />
                  <span>
                    {activeRole === "Student" ? "8.85 CGPA Target" : "+4.2% Peak Load"}
                  </span>
                </div>
              </div>

              {/* The Graph SVG */}
              <div className="h-56 relative w-full pt-4">
                <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#111827" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#111827" strokeDasharray="3 3" />
                  <line x1="0" y1="160" x2="500" y2="160" stroke="#111827" strokeDasharray="3 3" />

                  {/* Area fill */}
                  <path 
                    d="M0,200 L0,150 Q75,100 150,140 T300,70 Q375,110 450,50 L500,30 L500,200 Z" 
                    fill="url(#chartGradient)"
                  />

                  {/* Path line */}
                  <path 
                    d="M0,150 Q75,100 150,140 T300,70 Q375,110 450,50 L500,30" 
                    fill="none" 
                    stroke="url(#chartGradient)" 
                    strokeWidth="3" 
                    className="stroke-blue-500"
                  />
                  
                  {/* Performance dots */}
                  <circle cx="150" cy="140" r="4" fill="#60a5fa" stroke="#030712" strokeWidth="1.5" />
                  <circle cx="300" cy="70" r="4" fill="#8b5cf6" stroke="#030712" strokeWidth="1.5" />
                  <circle cx="450" cy="50" r="4" fill="#ec4899" stroke="#030712" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Legend */}
              <div className="flex gap-6 text-xs text-slate-500 pt-2 border-t border-slate-900">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>{activeRole === "Student" ? "Semester I" : "Student Admissions"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>{activeRole === "Student" ? "Semester II" : "Faculty Activity"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <span>{activeRole === "Student" ? "Semester III" : "Attendance Checks"}</span>
                </div>
              </div>
            </div>

            {/* Sidebar Calendar Panel */}
            <div className="lg:col-span-4 rounded-3xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-xl flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock size={16} className="text-purple-400" />
                  <span>Schedule Queue</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Faculty senate & class times</p>
                
                <div className="mt-6 space-y-3.5">
                  <div className="p-3 bg-slate-950 border border-slate-900 rounded-2xl space-y-1">
                    <p className="text-[10px] text-purple-400 font-bold uppercase">09:00 AM - 10:30 AM</p>
                    <p className="text-xs font-semibold text-white">CS-302 Advanced Algorithms</p>
                    <p className="text-[10px] text-slate-500">Dr. Sarah Jenkins • Room 402</p>
                  </div>

                  <div className="p-3 bg-slate-950/40 border border-slate-900/60 rounded-2xl space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">11:00 AM - 12:00 PM</p>
                    <p className="text-xs font-semibold text-slate-300">Physics Elective Audit</p>
                    <p className="text-[10px] text-slate-500">Dr. Richard Feynman • Hall B</p>
                  </div>
                </div>
              </div>

              <Link 
                to="/assistant" 
                className="group flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-500/10 text-xs text-slate-300 hover:text-white transition-colors duration-200"
              >
                <span className="font-medium">Need scheduling advice? Ask AI</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

          </div>

          {/* AI Insights & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* AI Insights (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-blue-400" />
                <span>Live AI Performance Insights</span>
              </h3>
              
              <div className="space-y-4">
                {activeRole === "Student" ? (
                  <InsightCard
                    title="AI Academic Recommendation"
                    description="You are currently at 92% attendance and predicted to score an A in Algorithms. To boost credits weight toward your target 8.85 CGPA, we recommend taking the upcoming Physics Elective audit option."
                    action="Opt-in Elective"
                  />
                ) : (
                  <InsightCard
                    title="Attendance Alert: Shortage Detected"
                    description="AI analysis has flagged 2 students (Neha Reddy, Anya Sen) whose current attendance rates are below the required 75% threshold. Recommended action: Draft automated warnings."
                    action="Draft Warn Letters"
                  />
                )}
              </div>
            </div>

            {/* Quick Actions (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xl font-bold text-white">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                
                {quickActions.map((action, index) => (
                  <div 
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="p-4 rounded-2xl bg-slate-900/40 border border-slate-900 hover:border-blue-500/30 hover:bg-slate-900/60 transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                      {action.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none">{action.title}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{action.desc}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>

          {/* Recent Activity Section */}
          <div className="pt-2">
            <RecentActivity />
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;
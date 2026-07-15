import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  BarChart3,
  Briefcase,
  CreditCard,
  Book,
  Home,
  Bot,
  Settings,
  LogOut,
  Sparkles,
  ClipboardList
} from "lucide-react";

function Sidebar() {
  const activeRole = localStorage.getItem("userRole") || "Admin";
  const activeName = localStorage.getItem("adminName") || "Shivam Jaiswal";

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/dashboard",
    },
    {
      name: "Students",
      icon: <Users size={18} />,
      path: "/students",
    },
    {
      name: "Faculty",
      icon: <GraduationCap size={18} />,
      path: "/faculty",
    },
    {
      name: "Courses",
      icon: <BookOpen size={18} />,
      path: "/courses",
    },
    {
      name: "Attendance",
      icon: <Calendar size={18} />,
      path: "/attendance",
    },
    {
      name: "Examination",
      icon: <ClipboardList size={18} />,
      path: "/examination",
    },
    {
      name: "Reports",
      icon: <BarChart3 size={18} />,
      path: "/reports",
    },
    {
      name: "Placements",
      icon: <Briefcase size={18} />,
      path: "/placements",
    },
    {
      name: "Fees Ledger",
      icon: <CreditCard size={18} />,
      path: "/fees",
    },
    {
      name: "Library",
      icon: <Book size={18} />,
      path: "/library",
    },
    {
      name: "Hostel Ops",
      icon: <Home size={18} />,
      path: "/hostel",
    },
    {
      name: "AI Assistant",
      icon: <Bot size={18} />,
      path: "/assistant",
      highlight: true,
    },
    {
      name: "Settings",
      icon: <Settings size={18} />,
      path: "/settings",
    },
  ];

  // Restructure visible routes depending on security clearance level
  const filteredMenuItems = menuItems.filter((item) => {
    if (activeRole === "Faculty") {
      const allowed = ["Dashboard", "Students", "Faculty", "Courses", "Attendance", "Examination", "AI Assistant", "Settings"];
      return allowed.includes(item.name);
    }
    if (activeRole === "Student") {
      const allowed = ["Dashboard", "Courses", "Attendance", "Examination", "Fees Ledger", "Library", "Hostel Ops", "AI Assistant", "Settings"];
      return allowed.includes(item.name);
    }
    return true; // Admin full access
  });

  const getRoleLabel = () => {
    if (activeRole === "Faculty") return "Teaching Faculty";
    if (activeRole === "Student") return "Student Portal";
    return "Administrator";
  };

  return (
    <aside className="w-64 min-h-screen bg-[#050814]/90 border-r border-slate-900 flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto">
      
      <div>
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-slate-950 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              </div>
              <span className="font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">SHIVIL AI</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
              University OS Term
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative ${
                  isActive
                    ? item.highlight
                      ? "bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 text-white shadow-lg shadow-purple-500/5"
                      : "bg-slate-900 border border-slate-800 text-white"
                    : item.highlight
                    ? "text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 hover:text-purple-300 border border-purple-500/10"
                    : "text-slate-400 hover:bg-slate-950 hover:text-slate-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`transition-colors duration-200 ${
                    isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-950">
        
        {/* User Card */}
        <div className="rounded-2xl bg-slate-950/80 border border-slate-900 p-3 mb-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold font-mono">
            {activeName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white truncate">{activeName}</h4>
            <p className="text-[10px] text-slate-500 truncate">{getRoleLabel()}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
        </div>

        {/* Logout button */}
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout Terminal</span>
        </NavLink>
      </div>

    </aside>
  );
}

export default Sidebar;
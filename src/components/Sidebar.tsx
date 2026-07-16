import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
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
  ClipboardList,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

function Sidebar() {
  const activeRole = localStorage.getItem("userRole") || "Admin";
  const activeName = localStorage.getItem("adminName") || "Shivam Jaiswal";

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebarCollapsed", String(nextState));
  };

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
    if (activeRole === "Student") return "Student";
    return "Admin";
  };

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#050814]/90 border-r border-white/5 flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto select-none z-30"
    >
      <div>
        {/* Brand Header */}
        <div className={`px-4 py-6 border-b border-white/5 flex items-center justify-between relative`}>
          {!isCollapsed ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-2"
            >
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2.5 group">
                <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shrink-0">
                  <Sparkles size={13} className="group-hover:rotate-12 transition-transform" />
                </div>
                <span className="font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">SHIVIL AI</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase mt-1">
                University OS Term
              </p>
            </motion.div>
          ) : (
            <div className="mx-auto">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                <Sparkles size={14} />
              </div>
            </div>
          )}

          {/* Collapse Toggle Switch */}
          <button 
            onClick={toggleCollapse}
            className={`absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition duration-200 cursor-pointer shadow-lg`}
          >
            {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 group relative ${
                  isActive
                    ? item.highlight
                      ? "bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 text-white shadow-lg"
                      : "bg-slate-900/60 border border-white/5 text-white"
                    : item.highlight
                    ? "text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 hover:text-purple-300 border border-purple-500/10"
                    : "text-slate-400 hover:bg-slate-950 hover:text-slate-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`transition-colors duration-200 shrink-0 ${
                    isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}>
                    {item.icon}
                  </span>
                  
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}

                  {/* Icon CSS-based tooltip for collapsed state */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg border border-white/5 bg-slate-950/95 text-slate-200 text-[9px] uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-2xl z-50 pointer-events-none select-none">
                      {item.name}
                    </span>
                  )}

                  {isActive && !isCollapsed && (
                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-white/5">
        
        {/* User Card */}
        <div className={`rounded-2xl bg-slate-950/80 border border-white/5 p-2 mb-3 flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-[11px] font-extrabold font-mono shrink-0">
            {activeName.charAt(0)}
          </div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 min-w-0"
            >
              <h4 className="text-[11px] font-bold text-white truncate leading-none">{activeName}</h4>
              <p className="text-[9px] text-slate-500 truncate mt-1 leading-none font-medium">{getRoleLabel()}</p>
            </motion.div>
          )}
          {!isCollapsed && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />}
        </div>

        {/* Logout button */}
        <NavLink
          to="/login"
          className={`flex items-center rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors ${isCollapsed ? "justify-center py-2.5" : "gap-3.5 px-4 py-2"}`}
        >
          <LogOut size={16} className="shrink-0" />
          {!isCollapsed && <span>Logout</span>}
          {isCollapsed && (
            <span className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg border border-red-500/20 bg-slate-950/95 text-red-400 text-[9px] uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-2xl z-50 pointer-events-none select-none">
              Logout
            </span>
          )}
        </NavLink>
      </div>

    </motion.aside>
  );
}

export default Sidebar;
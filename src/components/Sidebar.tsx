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
  ChevronRight,
  Workflow,
  Star,
  Clock
} from "lucide-react";

function Sidebar() {
  const authUserStr = localStorage.getItem("auth_user");
  const authUser = authUserStr ? JSON.parse(authUserStr) : null;
  const activeRole = authUser?.role || localStorage.getItem("userRole") || "Admin";
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
    { name: "Dashboard", icon: <LayoutDashboard size={16} />, path: "/dashboard", isFav: true },
    { name: "Students", icon: <Users size={16} />, path: "/students", isFav: false },
    { name: "Faculty", icon: <GraduationCap size={16} />, path: "/faculty", isFav: false },
    { name: "Courses", icon: <BookOpen size={16} />, path: "/courses", isFav: false },
    { name: "Attendance", icon: <Calendar size={16} />, path: "/attendance", isFav: false },
    { name: "Examination", icon: <ClipboardList size={16} />, path: "/examination", isFav: true, badge: 3 },
    { name: "Reports", icon: <BarChart3 size={16} />, path: "/reports", isFav: false },
    { name: "Placements", icon: <Briefcase size={16} />, path: "/placements", isFav: false },
    { name: "Fees Ledger", icon: <CreditCard size={16} />, path: "/fees", isFav: false },
    { name: "Library", icon: <Book size={16} />, path: "/library", isFav: false },
    { name: "Hostel Ops", icon: <Home size={16} />, path: "/hostel", isFav: false },
    { name: "Workflows", icon: <Workflow size={16} />, path: "/workflows", isFav: true, badge: 1 },
    { name: "AI Assistant", icon: <Bot size={16} />, path: "/assistant", highlight: true, isFav: false },
    { name: "Settings", icon: <Settings size={16} />, path: "/settings", isFav: false },
  ];

  // Restructure visible routes depending on security clearance level
  const filteredMenuItems = menuItems.filter((item) => {
    if (activeRole === "Faculty") {
      const allowed = ["Dashboard", "Students", "Faculty", "Courses", "Attendance", "Examination", "Workflows", "AI Assistant", "Settings"];
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

  const favorites = filteredMenuItems.filter(item => item.isFav);
  const others = filteredMenuItems.filter(item => !item.isFav);

  const recents = [
    { name: "Attendance Check", path: "/attendance" },
    { name: "CSE Registries", path: "/students" }
  ];

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 76 : 240 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#050814]/90 border-r border-white/5 flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto select-none z-30"
    >
      <div>
        {/* Brand Header */}
        <div className="px-4 py-5 border-b border-white/5 flex items-center justify-between relative">
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
            className="absolute top-1/2 -translate-y-1/2 -right-3 w-5 h-5 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition duration-200 cursor-pointer shadow-lg z-50"
          >
            {isCollapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
          </button>
        </div>

        {/* Favorites Section (if not collapsed) */}
        {!isCollapsed && (
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold text-slate-500">
              <Star size={10} className="text-amber-500" />
              <span>Favorites</span>
            </div>
          </div>
        )}

        <nav className="px-3.5 space-y-0.5">
          {(isCollapsed ? filteredMenuItems : favorites).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 group relative ${
                  isActive
                    ? item.highlight
                      ? "bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 text-white shadow-lg"
                      : "bg-slate-900/60 border border-white/5 text-white"
                    : item.highlight
                    ? "text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 hover:text-purple-300 border border-purple-500/10"
                    : "text-slate-400 hover:bg-slate-900/30 hover:text-slate-200"
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

                  {/* Unread Counter Badge */}
                  {item.badge !== undefined && !isCollapsed && (
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 leading-none font-mono">
                      {item.badge}
                    </span>
                  )}

                  {isCollapsed && (
                    <span className="absolute left-full ml-4 px-2.5 py-1.5 rounded-lg border border-white/5 bg-slate-950/95 text-slate-200 text-[9px] uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-2xl z-50 pointer-events-none select-none whitespace-nowrap">
                      {item.name} {item.badge !== undefined ? `(${item.badge})` : ""}
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

        {/* Regular Menu Items Section (if not collapsed) */}
        {!isCollapsed && (
          <>
            <div className="px-5 pt-4 pb-2">
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold text-slate-500">
                <span>Modules</span>
              </div>
            </div>
            <nav className="px-3.5 space-y-0.5">
              {others.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 group relative ${
                      isActive
                        ? item.highlight
                          ? "bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 text-white shadow-lg"
                          : "bg-slate-900/60 border border-white/5 text-white"
                        : item.highlight
                        ? "text-purple-400 bg-purple-500/5 hover:bg-purple-500/10 hover:text-purple-300 border border-purple-500/10"
                        : "text-slate-400 hover:bg-slate-900/30 hover:text-slate-200"
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
                      
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 truncate"
                      >
                        {item.name}
                      </motion.span>

                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 leading-none font-mono">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Recent History List */}
            <div className="px-5 pt-5 pb-2">
              <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold text-slate-500">
                <Clock size={10} />
                <span>Recents</span>
              </div>
            </div>
            <div className="px-5 space-y-2">
              {recents.map((rec, idx) => (
                <NavLink 
                  key={idx} 
                  to={rec.path} 
                  className="block text-[10px] text-slate-500 hover:text-slate-300 truncate transition duration-150 font-semibold"
                >
                  {rec.name}
                </NavLink>
              ))}
            </div>
          </>
        )}
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
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Command, 
  Users, 
  GraduationCap, 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  Bot, 
  FileText,
  CornerDownLeft,
  X
} from "lucide-react";
import type { Student } from "../types/student";
import type { Faculty } from "../types/faculty";

function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Listen for Cmd+K or Ctrl+K triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch search items from local storage databases
  const searchItems = (() => {
    const students: Student[] = JSON.parse(localStorage.getItem("students") || "[]");
    const faculty: Faculty[] = JSON.parse(localStorage.getItem("faculty") || "[]");

    const navigationLinks = [
      { id: "nav-dash", category: "Navigation", title: "Go to Dashboard", path: "/dashboard", icon: <LayoutDashboard size={14} /> },
      { id: "nav-stud", category: "Navigation", title: "Go to Students Registry", path: "/students", icon: <Users size={14} /> },
      { id: "nav-fac", category: "Navigation", title: "Go to Faculty Directory", path: "/faculty", icon: <GraduationCap size={14} /> },
      { id: "nav-att", category: "Navigation", title: "Go to Attendance Audit", path: "/attendance", icon: <Calendar size={14} /> },
      { id: "nav-ai", category: "Navigation", title: "Go to AI Assistant Panel", path: "/assistant", icon: <Bot size={14} /> },
      { id: "nav-set", category: "Navigation", title: "Go to OS Settings", path: "/settings", icon: <Settings size={14} /> }
    ];

    const studentItems = students.map(s => ({
      id: `stud-${s.id}`,
      category: "Students",
      title: `${s.name} (${s.roll})`,
      path: "/students",
      icon: <Users size={14} className="text-blue-400" />
    }));

    const facultyItems = faculty.map(f => ({
      id: `fac-${f.id}`,
      category: "Faculty",
      title: f.name,
      path: "/faculty",
      icon: <GraduationCap size={14} className="text-purple-400" />
    }));

    const all = [...navigationLinks, ...studentItems, ...facultyItems];

    if (!search.trim()) return all.slice(0, 7); // Show default entries if search empty

    return all.filter(item => 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    );
  })();

  // Handle keyboard navigation within menu options
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(searchItems.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + searchItems.length) % Math.max(searchItems.length, 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (searchItems[selectedIndex]) {
          handleAction(searchItems[selectedIndex]);
        }
      }
    };
    window.addEventListener("keydown", handleNavigation);
    return () => window.removeEventListener("keydown", handleNavigation);
  }, [isOpen, selectedIndex, searchItems]);

  const handleAction = (item: typeof searchItems[0]) => {
    setIsOpen(false);
    setSearch("");
    navigate(item.path);
  };

  // Close when clicking outside modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        ref={menuRef}
        className="relative w-full max-w-lg rounded-3xl border border-white/5 bg-slate-950 p-4 shadow-2xl overflow-hidden flex flex-col max-h-[440px]"
      >
        {/* Glow indicator line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* Input Bar */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-900">
          <Search className="text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Type navigation, student names, or faculty..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none py-1.5"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-500">
            ESC
          </kbd>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={12} />
          </button>
        </div>

        {/* Search results list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 mt-2">
          {searchItems.length === 0 ? (
            <p className="text-[11px] text-slate-600 text-center py-8">No terminal logs match your search.</p>
          ) : (
            searchItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleAction(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected 
                      ? "bg-slate-900 border border-slate-850 text-white" 
                      : "border border-transparent text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isSelected ? "text-blue-400" : "text-slate-500"}>
                      {item.icon}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-semibold">{item.title}</span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-[9px] font-mono text-slate-500 flex items-center gap-0.5 uppercase">
                      <span>Select</span>
                      <CornerDownLeft size={10} />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Commands Footer instruction */}
        <div className="border-t border-slate-900 pt-3 px-3 flex items-center justify-between text-[9px] text-slate-600 font-medium font-mono select-none">
          <div className="flex gap-4">
            <span>↑↓ Navigate</span>
            <span>Enter Select</span>
          </div>
          <span>SHIVIL COMMAND CENTER</span>
        </div>

      </div>
    </div>
  );
}

export default CommandMenu;

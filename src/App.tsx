import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";

import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import StudentManagement from "./pages/StudentManagement";
import Faculty from "./pages/Faculty";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Placements from "./pages/Placements";
import Fees from "./pages/Fees";
import Library from "./pages/Library";
import Hostel from "./pages/Hostel";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";
import DesignTest from "./pages/DesignTest";
import CommandMenu from "./components/CommandMenu";

import notificationsData from "../mock-data/notifications.json";

function App() {
  const [activeToast, setActiveToast] = useState<{ title: string; desc: string } | null>(null);

  useEffect(() => {
    const mockEvents = notificationsData;

    // Seed initial welcome toast after 4 seconds
    const initialTimeout = setTimeout(() => {
      setActiveToast({ title: "OS Terminal Active", desc: "SHIVIL AI University Terminal loaded successfully." });
      setTimeout(() => setActiveToast(null), 5000);
    }, 4000);

    const interval = setInterval(() => {
      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      setActiveToast(randomEvent);
      
      // Auto-hide toast after 5 seconds
      setTimeout(() => {
        setActiveToast(null);
      }, 5000);
    }, 28000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      {/* Global command center shortcuts (Ctrl+K or Cmd+K) */}
      <CommandMenu />

      {/* Background Event Toast Notification */}
      {activeToast && (
        <div className="fixed top-6 right-6 z-[100] max-w-sm rounded-2xl border border-white/5 bg-slate-950/90 backdrop-blur-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-slide-in flex items-start gap-3 select-none">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <div className="flex-1 space-y-0.5">
            <h4 className="text-xs font-bold text-white leading-none">{activeToast.title}</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-1">{activeToast.desc}</p>
          </div>
          <button 
            onClick={() => setActiveToast(null)} 
            className="p-1 rounded bg-slate-900 hover:bg-slate-850 text-slate-500 hover:text-white transition shrink-0"
          >
            <X size={10} />
          </button>
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/placements" element={<Placements />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/library" element={<Library />} />
        <Route path="/hostel" element={<Hostel />} />
        
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/design" element={<DesignTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { Sparkles, X } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Code splitting dynamic page segments
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/LoginPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudentManagement = lazy(() => import("./pages/StudentManagement"));
const Faculty = lazy(() => import("./pages/Faculty"));
const Courses = lazy(() => import("./pages/Courses"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Examination = lazy(() => import("./pages/Examination"));
const Reports = lazy(() => import("./pages/Reports"));
const Placements = lazy(() => import("./pages/Placements"));
const Fees = lazy(() => import("./pages/Fees"));
const Library = lazy(() => import("./pages/Library"));
const Hostel = lazy(() => import("./pages/Hostel"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Workflows = lazy(() => import("./pages/Workflows"));
const Settings = lazy(() => import("./pages/Settings"));
const DesignTest = lazy(() => import("./pages/DesignTest"));
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
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
      
      <Suspense fallback={
        <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-xs text-slate-500 font-sans select-none space-y-3.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shrink-0 animate-spin shadow-lg">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <span className="font-bold tracking-widest uppercase text-[9px] text-slate-600 mt-2 animate-pulse">Initializing OS Module...</span>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><StudentManagement /></ProtectedRoute>} />
          <Route path="/faculty" element={<ProtectedRoute><Faculty /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/examination" element={<ProtectedRoute><Examination /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/placements" element={<ProtectedRoute><Placements /></ProtectedRoute>} />
          <Route path="/fees" element={<ProtectedRoute><Fees /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/hostel" element={<ProtectedRoute><Hostel /></ProtectedRoute>} />
          
          <Route path="/assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/workflows" element={<ProtectedRoute><Workflows /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/design" element={<ProtectedRoute><DesignTest /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </QueryClientProvider>
</ErrorBoundary>
  );
}

export default App;
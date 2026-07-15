import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { 
  Settings as SettingsIcon, 
  Sparkles, 
  Database, 
  User, 
  Shield, 
  Sliders, 
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

function Settings() {
  const [threshold, setThreshold] = useState("75");
  const [model, setModel] = useState("gemini-1.5-flash");
  const [adminName, setAdminName] = useState(() => {
    return localStorage.getItem("adminName") || "Shivam Jaiswal";
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem("userRole") || "Admin";
  });
  const [toastMessage, setToastMessage] = useState("");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userRole", role);
    localStorage.setItem("adminName", adminName);
    
    // Automatically alter display name depending on role to make it realistic
    if (role === "Faculty" && !adminName.startsWith("Dr.")) {
      setAdminName("Dr. Sarah Jenkins");
      localStorage.setItem("adminName", "Dr. Sarah Jenkins");
    } else if (role === "Student") {
      setAdminName("Arjun Sharma");
      localStorage.setItem("adminName", "Arjun Sharma");
    } else if (role === "Admin" && (adminName.startsWith("Dr.") || adminName === "Arjun Sharma")) {
      setAdminName("Shivam Jaiswal");
      localStorage.setItem("adminName", "Shivam Jaiswal");
    }

    setToastMessage("⚙️ Terminal parameters saved. Sidebar and dashboard clearance adjusted.");
    setTimeout(() => {
      setToastMessage("");
      window.location.reload(); // Reload to refresh sidebar menus
    }, 1200);
  };

  const handleReSeed = () => {
    localStorage.removeItem("students");
    localStorage.removeItem("faculty");
    setToastMessage("♻️ Database re-seeded with factory defaults. Reloading page...");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />
      
      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8 relative">
          
          {/* Toast */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-500/30 text-white text-xs font-semibold px-4 py-3.5 rounded-2xl shadow-2xl">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <SettingsIcon className="text-slate-400 animate-spin-slow" size={28} />
                <span>OS Parameters</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Configure database keys, threshold metrics, and AI assistant models.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Form settings options (8 cols) */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Security clearance role simulator */}
              <div className="p-6 rounded-3xl border border-blue-500/10 bg-slate-950/40 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield size={16} className="text-blue-400" />
                  <span>Security Clearance Simulation</span>
                </h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Simulated User Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="Admin">Administrator (Full Clearance)</option>
                    <option value="Faculty">Teaching Faculty (Dr. Sarah Jenkins)</option>
                    <option value="Student">Registered Student (Arjun Sharma)</option>
                  </select>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Switching roles alters the Sidebar routes, greeting cards, and dashboard metrics filters.
                  </p>
                </div>
              </div>

              {/* Profile Config */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <User size={16} className="text-blue-400" />
                  <span>Administrative Identity</span>
                </h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Admin Display Name</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              {/* Threshold Parameters */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders size={16} className="text-purple-400" />
                  <span>Syllabus & Audit Thresholds</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Attendance Warning Boundary (%)</label>
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    min="50"
                    max="100"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-purple-500/50 font-mono"
                  />
                  <p className="text-[10px] text-slate-600">Students falling below this percentage trigger administrative shortage flags automatically.</p>
                </div>
              </div>

              {/* AI Parameters */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-pink-400" />
                  <span>AI Model Backend</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Model Engine Configuration</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-pink-500/50"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Latency-focused)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (In-depth analysis)</option>
                    <option value="openai-gpt-4o">OpenAI GPT-4o (General operations)</option>
                  </select>
                </div>
              </div>

              {/* Save trigger */}
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-xs font-semibold text-white shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.01]"
              >
                Save OS Parameters
              </button>

            </div>

            {/* Side tools & safety configurations (4 cols) */}
            <div className="md:col-span-4 space-y-6">
              
              <div className="p-6 rounded-3xl border border-red-500/15 bg-red-950/5 space-y-4">
                <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>Terminal Diagnostics</span>
                </h3>
                
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Reset the local storage registries to clear student modifications and restore default faculty listings seeded on the dashboard hub.
                </p>

                <button
                  type="button"
                  onClick={handleReSeed}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold text-red-400 transition"
                >
                  Restore System Seeds
                </button>
              </div>

            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

export default Settings;
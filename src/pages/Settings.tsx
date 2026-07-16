import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { 
  Settings as SettingsIcon, 
  Sparkles, 
  Database, 
  User, 
  Shield, 
  Sliders, 
  CheckCircle2,
  AlertTriangle,
  Building,
  Key,
  FolderLock,
  Palette,
  CreditCard,
  Layers,
  DatabaseBackup,
  History,
  FileCode,
  CheckCircle,
  Plus
} from "lucide-react";

type SettingsTab = "organization" | "roles" | "security" | "audit" | "ai" | "billing" | "integrations";

function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("organization");
  const [toastMessage, setToastMessage] = useState("");

  // Role simulation state (retained from original Settings page)
  const [role, setRole] = useState(() => localStorage.getItem("userRole") || "Admin");
  const [adminName, setAdminName] = useState(() => localStorage.getItem("adminName") || "Shivam Jaiswal");
  
  // Organization settings states
  const [orgName, setOrgName] = useState("Apex Global University");
  const [orgDomain, setOrgDomain] = useState("apex.edu");
  const [orgTheme, setOrgTheme] = useState("Dark Neo");

  // AI settings states
  const [threshold, setThreshold] = useState("75");
  const [aiModel, setAiModel] = useState("gemini-1.5-flash");

  // API keys list
  const [apiKeys, setApiKeys] = useState([
    { name: "LMS Connect", key: "sk_live_apex_842x...88a", date: "June 20, 2026", status: "Active" },
    { name: "Placements Integration", key: "sk_live_apex_110y...32b", date: "July 04, 2026", status: "Active" }
  ]);

  const auditLogs = [
    { actor: "Dr. Sarah Jenkins", action: "Approved midterms curves for CS-302", time: "11:24 AM" },
    { actor: "Admin Shivam Jaiswal", action: "Changed system clearance levels", time: "Yesterday" },
    { actor: "Dean Office", action: "Dispatched research grant funding", time: "2 days ago" }
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userRole", role);
    localStorage.setItem("adminName", adminName);
    
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

    triggerToast("⚙️ Enterprise parameters saved. Systems syncing...");
    setTimeout(() => {
      window.location.reload(); 
    }, 1200);
  };

  const handleReSeed = () => {
    localStorage.removeItem("students");
    localStorage.removeItem("faculty");
    triggerToast("♻️ Database re-seeded with defaults. Reloading page...");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="flex min-h-screen bg-[#030712] font-sans text-slate-100 selection:bg-blue-500/20 overflow-hidden h-screen select-none">
      <Sidebar />
      
      {/* Enterprise split settings dashboard */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Header Toolbar */}
        <div className="px-6 py-4.5 border-b border-white/5 bg-[#050814]/50 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2 leading-none">
              <SettingsIcon className="text-slate-400 animate-spin-slow" size={15} />
              <span>Enterprise Admin Studio</span>
            </h1>
            <p className="text-[10px] text-slate-500 mt-1.5 font-semibold">System Configuration & Security Clearances</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-400 font-mono px-2 py-0.5 rounded border border-white/5 bg-slate-900 leading-none">
              v2.4.0 Stable
            </span>
          </div>
        </div>

        {/* Workspace body split panels */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          
          {/* LEFT SUB-NAVBAR TABS (w-full on mobile, w-64 on desktop) */}
          <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#050814]/70 p-4 space-y-2 shrink-0 h-auto lg:h-full overflow-y-auto select-none">
            
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 px-2 select-none hidden lg:block">
              Categories
            </span>

            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 lg:gap-1 pb-1 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab("organization")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shrink-0 lg:shrink w-auto lg:w-full ${
                  activeTab === "organization" ? "bg-slate-900 text-white border border-white/5" : "text-slate-400 hover:bg-slate-950/50 hover:text-slate-200"
                }`}
              >
                <Building size={14} />
                <span>Organization</span>
              </button>

              <button
                onClick={() => setActiveTab("roles")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shrink-0 lg:shrink w-auto lg:w-full ${
                  activeTab === "roles" ? "bg-slate-900 text-white border border-white/5" : "text-slate-400 hover:bg-slate-950/50 hover:text-slate-200"
                }`}
              >
                <Shield size={14} />
                <span>Roles & Clearance</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shrink-0 lg:shrink w-auto lg:w-full ${
                  activeTab === "security" ? "bg-slate-900 text-white border border-white/5" : "text-slate-400 hover:bg-slate-950/50 hover:text-slate-200"
                }`}
              >
                <Key size={14} />
                <span>API Keys</span>
              </button>

              <button
                onClick={() => setActiveTab("audit")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shrink-0 lg:shrink w-auto lg:w-full ${
                  activeTab === "audit" ? "bg-slate-900 text-white border border-white/5" : "text-slate-400 hover:bg-slate-950/50 hover:text-slate-200"
                }`}
              >
                <FolderLock size={14} />
                <span>Audit Log</span>
              </button>

              <button
                onClick={() => setActiveTab("ai")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shrink-0 lg:shrink w-auto lg:w-full ${
                  activeTab === "ai" ? "bg-slate-900 text-white border border-white/5" : "text-slate-400 hover:bg-slate-950/50 hover:text-slate-200"
                }`}
              >
                <Sparkles size={14} />
                <span>AI Config</span>
              </button>

              <button
                onClick={() => setActiveTab("billing")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shrink-0 lg:shrink w-auto lg:w-full ${
                  activeTab === "billing" ? "bg-slate-900 text-white border border-white/5" : "text-slate-400 hover:bg-slate-950/50 hover:text-slate-200"
                }`}
              >
                <CreditCard size={14} />
                <span>Billing</span>
              </button>

              <button
                onClick={() => setActiveTab("integrations")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition shrink-0 lg:shrink w-auto lg:w-full ${
                  activeTab === "integrations" ? "bg-slate-900 text-white border border-white/5" : "text-slate-400 hover:bg-slate-950/50 hover:text-slate-200"
                }`}
              >
                <Layers size={14} />
                <span>Backups</span>
              </button>
            </div>

          </aside>

          {/* RIGHT VIEWPORT CONTENT: Forms configuration */}
          <section className="flex-1 bg-slate-950/20 p-6 md:p-8 overflow-y-auto h-full min-w-0">
            <form onSubmit={handleSaveSettings} className="max-w-3xl space-y-6">
              
              {/* Tab: Organization */}
              {activeTab === "organization" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-900 pb-3">
                    <h2 className="text-sm font-bold text-white leading-none">Organization Parameters</h2>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-none">Configure institution identity and global portal brandings</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900/60 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block select-none">Organization Name</label>
                      <input 
                        value={orgName} 
                        onChange={(e) => setOrgName(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-900 text-xs text-white focus:outline-none focus:border-slate-800 font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block select-none">Institution Domain</label>
                      <input 
                        value={orgDomain} 
                        onChange={(e) => setOrgDomain(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-900 text-xs text-white focus:outline-none focus:border-slate-800 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Roles & Clearances */}
              {activeTab === "roles" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-900 pb-3">
                    <h2 className="text-sm font-bold text-white leading-none">Roles & Clearance Simulator</h2>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-none">Simulate route availability depending on clearances levels</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900/60 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block select-none">Active Simulated Role</label>
                      <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-900 text-xs text-white focus:outline-none focus:border-slate-800 font-semibold"
                      >
                        <option value="Admin">Administrator (Full Access)</option>
                        <option value="Faculty">Teaching Faculty (Dr. Sarah Jenkins)</option>
                        <option value="Student">Registered Student (Arjun Sharma)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block select-none">Admin Profile Initial Name</label>
                      <input 
                        value={adminName} 
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-900 text-xs text-white focus:outline-none focus:border-slate-800 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: API Keys */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-900 pb-3">
                    <h2 className="text-sm font-bold text-white leading-none">Security API Credentials</h2>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-none">Manage tokens for third-party LMS and placements connecting tools</p>
                  </div>

                  <div className="space-y-2.5">
                    {apiKeys.map((k, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white leading-none">{k.name}</p>
                          <p className="text-[9px] text-slate-500 font-mono mt-1.5 leading-none">{k.key} • Created {k.date}</p>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                          {k.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => triggerToast("New security credential token created.")}
                    className="py-2.5 px-4 rounded-xl border border-slate-900 bg-slate-950 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus size={13} />
                    <span>Create API Key</span>
                  </button>
                </div>
              )}

              {/* Tab: Audit logs */}
              {activeTab === "audit" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-900 pb-3">
                    <h2 className="text-sm font-bold text-white leading-none">System Audit Logs</h2>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-none">Log table of administrative modifications in the OS terminal</p>
                  </div>

                  <div className="space-y-3">
                    {auditLogs.map((log, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 flex justify-between items-center text-xs">
                        <div className="min-w-0">
                          <p className="font-semibold text-white leading-none">{log.action}</p>
                          <p className="text-[9px] text-slate-500 mt-1.5 leading-none">{log.actor}</p>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 shrink-0 select-none">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: AI configuration */}
              {activeTab === "ai" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-900 pb-3">
                    <h2 className="text-sm font-bold text-white leading-none">AI Assistant Parameters</h2>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-none">Configure Gemini models and compliance shortage parameters</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900/60 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block select-none">AI Model Engine</label>
                      <select 
                        value={aiModel} 
                        onChange={(e) => setAiModel(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-900 text-xs text-white focus:outline-none focus:border-slate-800 font-semibold"
                      >
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Latency-focused)</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (In-depth analysis)</option>
                        <option value="openai-gpt-4o">OpenAI GPT-4o (General operations)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block select-none">Attendance Warning Boundary (%)</label>
                      <input 
                        type="number"
                        min="50"
                        max="100"
                        value={threshold} 
                        onChange={(e) => setThreshold(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-900 text-xs text-white focus:outline-none focus:border-slate-800 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Billing */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-900 pb-3">
                    <h2 className="text-sm font-bold text-white leading-none">Billing & Subscription Plan</h2>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-none">Verify billing details and seat licenses limits</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 flex justify-between items-center group hover:border-slate-800 transition">
                    <div>
                      <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest font-mono bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded leading-none">
                        Enterprise Plan
                      </span>
                      <p className="text-xs font-bold text-white mt-3 leading-none">Apex Global University Subscription</p>
                      <p className="text-[9px] text-slate-500 mt-1.5 leading-none">820 / 1,500 active user seats allocated</p>
                    </div>
                    <span className="text-xs font-extrabold text-white font-mono shrink-0 select-none">
                      Active
                    </span>
                  </div>
                </div>
              )}

              {/* Tab: Integrations & Backups */}
              {activeTab === "integrations" && (
                <div className="space-y-6">
                  <div className="border-b border-slate-900 pb-3">
                    <h2 className="text-sm font-bold text-white leading-none">Integrations & System seeds</h2>
                    <p className="text-[10px] text-slate-500 mt-1.5 leading-none">Audit external connections or trigger default system re-seeding</p>
                  </div>

                  <div className="p-4 rounded-2xl border border-red-500/15 bg-red-950/5 space-y-3.5">
                    <div className="flex gap-2">
                      <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-red-400 leading-none">Seeding and Defaults reset</p>
                        <p className="text-[9px] text-slate-500 mt-1.5 leading-relaxed">
                          This resets student registries and database logs to default states. All manual visual changes to profiles will be cleared.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleReSeed}
                      className="w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-[10px] font-bold text-red-400 transition cursor-pointer"
                    >
                      Clear Modifications & Re-Seed
                    </button>
                  </div>
                </div>
              )}

              {/* Save changes footer bar */}
              <div className="pt-5 border-t border-slate-900 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-xs font-bold text-white shadow-xl shadow-blue-500/10 transition cursor-pointer"
                >
                  Save Parameters
                </button>
              </div>

            </form>
          </section>

        </div>

      </main>

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
    </div>
  );
}

export default Settings;
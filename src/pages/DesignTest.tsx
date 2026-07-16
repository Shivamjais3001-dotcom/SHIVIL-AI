import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CalendarDays, 
  Sparkles, 
  Search, 
  AlertCircle, 
  Plus, 
  Trash, 
  Mail,
  ChevronRight,
  Database,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";

import StatCard from "../components/ui/StatCard";
import InsightCard from "../components/ui/InsightCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

function DesignTest() {
  const [activeTab, setActiveTab] = useState<"buttons" | "inputs" | "badges" | "states">("buttons");
  const [inputText, setInputText] = useState("");

  return (
    <div className="flex min-h-screen bg-[#030712] font-sans selection:bg-blue-500/20 text-slate-100 overflow-x-hidden">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="border-b border-slate-900 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Sparkles size={24} className="text-blue-400" />
              <span>SHIVIL AI Design Tokens & Showroom</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Interactive workspace demonstrating global styling variables, reusable components, and UX patterns.
            </p>
          </div>

          {/* Design Token Preview Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Background Layer</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-5 h-5 rounded bg-[#030712] border border-white/10" />
                <span className="text-xs font-mono font-semibold text-white">#030712</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Primary Blue</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-5 h-5 rounded bg-blue-500" />
                <span className="text-xs font-mono font-semibold text-white">#3b82f6</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Secondary Purple</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-5 h-5 rounded bg-purple-500" />
                <span className="text-xs font-mono font-semibold text-white">#8b5cf6</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-1">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Accent Pink</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-5 h-5 rounded bg-pink-500" />
                <span className="text-xs font-mono font-semibold text-white">#ec4899</span>
              </div>
            </div>
          </div>

          {/* Cards Showcase */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold px-1">Smart Cards</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard
                title="Students"
                value="12,450"
                subtitle="Registered active profiles"
                trend="+12%"
                icon={<Users size={16} />}
              />
              <StatCard
                title="Faculty"
                value="850"
                subtitle="Active professors"
                trend="+5%"
                icon={<GraduationCap size={16} />}
              />
              <StatCard
                title="Syllabus Courses"
                value="150"
                subtitle="Curriculum electives"
                trend="Aligned"
                icon={<BookOpen size={16} />}
              />
              <StatCard
                title="Daily Attendance"
                value="95%"
                subtitle="Average check-in index"
                trend="+2%"
                icon={<CalendarDays size={16} />}
              />
            </div>
          </div>

          {/* Tab Selector for Component Library */}
          <div className="space-y-6">
            <div className="flex bg-slate-950 border border-white/5 p-1 rounded-2xl gap-1 w-fit select-none">
              <button 
                onClick={() => setActiveTab("buttons")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "buttons" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Buttons
              </button>
              <button 
                onClick={() => setActiveTab("inputs")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "inputs" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Inputs & Search
              </button>
              <button 
                onClick={() => setActiveTab("badges")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "badges" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Badges & Tags
              </button>
              <button 
                onClick={() => setActiveTab("states")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === "states" ? "bg-slate-900 border border-white/5 text-blue-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                Empty / States
              </button>
            </div>

            {/* Content Windows */}
            <div className="rounded-3xl border border-white/5 bg-slate-950/40 p-6 md:p-8 backdrop-blur-xl">
              {activeTab === "buttons" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Interactive Button Tokens</h4>
                    <p className="text-[11px] text-slate-500">Standard variants utilizing base-ui triggers.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="default">Primary Default</Button>
                    <Button variant="secondary">Secondary Purple</Button>
                    <Button variant="outline">Outline Glass</Button>
                    <Button variant="ghost">Ghost Accent</Button>
                    <Button variant="destructive">Destructive Alert</Button>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center pt-2">
                    <Button variant="default" size="xs">Extra Small</Button>
                    <Button variant="default" size="sm">Small Size</Button>
                    <Button variant="default" size="default">Default size</Button>
                    <Button variant="default" size="lg">Large button</Button>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center pt-2">
                    <Button variant="outline" className="gap-2">
                      <Plus size={14} />
                      <span>Add Student</span>
                    </Button>
                    <Button variant="destructive" className="gap-2">
                      <Trash size={14} />
                      <span>Delete Record</span>
                    </Button>
                    <Button variant="secondary" className="gap-2">
                      <Mail size={14} />
                      <span>Send Notice</span>
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "inputs" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Inputs & Universal Search Templates</h4>
                    <p className="text-[11px] text-slate-500">Accessible form inputs and shortcut palette links.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Text input */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Input Label</label>
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type student name or email..."
                        className="w-full px-4 py-2 text-xs rounded-xl bg-slate-950 border border-white/5 hover:border-slate-800 focus:border-blue-500/50 focus:outline-none transition duration-200 text-white placeholder-slate-600 font-sans"
                      />
                    </div>

                    {/* Command bar shortcut */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Command Search Trigger</label>
                      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-950 border border-white/5 hover:border-slate-800 transition duration-200 text-slate-500 text-xs select-none cursor-pointer">
                        <Search size={14} />
                        <span>Search registries...</span>
                        <span className="ml-auto font-mono text-[9px] bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-slate-500">Ctrl+K</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "badges" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Status Badges & Chips</h4>
                    <p className="text-[11px] text-slate-500">Conveys clear status labels across lists and tables.</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">Approved</Badge>
                    <Badge variant="secondary">In Progress</Badge>
                    <Badge variant="destructive">Failed / Low Attendance</Badge>
                    <Badge variant="outline">Draft Mode</Badge>
                  </div>
                </div>
              )}

              {activeTab === "states" && (
                <div className="space-y-8">
                  
                  {/* Empty state component */}
                  <div className="p-8 rounded-2xl bg-slate-950/50 border border-white/5 flex flex-col items-center text-center space-y-4 max-w-md mx-auto">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Database size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">No query logs coordinated</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                        Your workspace databases do not hold any query logs matching these parameters.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus size={12} />
                      <span>Create New Record</span>
                    </Button>
                  </div>

                  <hr className="border-slate-900" />

                  {/* Loading skeleton component */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Loading Skeletons</h5>
                    <div className="p-4 rounded-xl border border-white/5 space-y-3 max-w-sm">
                      <div className="flex items-center gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-slate-900 shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2 bg-slate-900 rounded w-1/3" />
                          <div className="h-1.5 bg-slate-900 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-900" />

                  {/* Error state component */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Error Notifications</h5>
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-center gap-3 max-w-md">
                      <AlertCircle size={16} className="shrink-0 animate-pulse" />
                      <span>Verification check failed: Unapproved marks cannot be locked on transcript sheets.</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* Insight card showcase */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold px-1">AI Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InsightCard
                title="System Workload Optimization"
                description="Our AI audit shows database response averages have dropped to 12ms. Running result processing jobs has decreased peak load allocations by 35% on the main server."
                action="Verify Database Uptime"
              />
              <InsightCard
                title="Marks Moderation Checklist"
                description="There are currently 3 mark sheets waiting for locking in Faculty offerings. Approve and push them into primary ledger tables to authorize grades."
                action="Go to Marks Moderation"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default DesignTest;
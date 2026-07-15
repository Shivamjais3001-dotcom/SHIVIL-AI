import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Terminal, 
  Bot, 
  CheckCircle2, 
  Send,
  Calendar
} from "lucide-react";

function Hero() {
  const [activeTab, setActiveTab] = useState("overview");
  const [aiInput, setAiInput] = useState("");
  const [aiOutput, setAiOutput] = useState("Type a command or click a quick prompt below...");
  const [isTyping, setIsTyping] = useState(false);

  const prompts = [
    { text: "Show attendance below 75%", reply: "🔍 Querying attendance records...\n⚠️ Alert: 3 students in CS-301 are below the 75% threshold.\n📧 Notification emails drafted for Faculty Advisors." },
    { text: "Predict CS-101 grade distribution", reply: "🔮 Running AI Predictive Grade Analytics for CS-101...\n📈 Projected pass rate: 94.2%\n🎯 Recommendation: Suggest tutor sessions for 4 students at academic risk." },
    { text: "Faculty workload balance", reply: "📊 Loading work-hours metric...\n✅ All CS faculty workloads are in optimal range (12-16 hours/week).\n💡 Suggestion: Allocate remaining elective to Dr. Sarah Jenkins." }
  ];

  const handlePromptClick = (promptText: string, replyText: string) => {
    if (isTyping) return;
    setAiInput(promptText);
    setIsTyping(true);
    setAiOutput("");
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < replyText.length) {
        setAiOutput((prev) => prev + replyText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#030712]">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Content */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-400 animate-pulse-slow">
            <Sparkles size={14} />
            <span>AI-First University Operating System</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Imagine a university run like <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Linear & Vercel.</span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-xl">
            Meet SHIVIL AI. A premium, ultra-fast dashboard operating system with an autonomous AI interface designed to streamline student portals, faculty loads, course schedules, and analytics reports under one unified architecture.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/login"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-xl shadow-blue-500/20 hover:scale-[1.02] hover:shadow-blue-500/35 transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Launch SHIVIL OS</span>
              <Terminal size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <a
              href="#ai-demo"
              className="px-6 py-3 rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-300 font-medium hover:text-white hover:bg-slate-900 hover:border-slate-700 transition-all duration-300 flex items-center gap-2"
            >
              <span>Interactive Demo</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-900">
            <div>
              <p className="text-2xl font-bold text-white">99.8%</p>
              <p className="text-xs text-slate-500 font-medium">Uptime Guarantee</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">&lt; 15ms</p>
              <p className="text-xs text-slate-500 font-medium">Average Response</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">85%</p>
              <p className="text-xs text-slate-500 font-medium">FTE Workload Saved</p>
            </div>
          </div>

        </div>

        {/* Right Content - Interactive Preview */}
        <div className="lg:col-span-7 w-full">
          
          <div className="relative group">
            {/* Ambient card background glow */}
            <div className="absolute -inset-1 rounded-[2.1rem] bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl group-hover:opacity-30 transition-all duration-500 pointer-events-none" />
            
            {/* The Browser Sandbox */}
            <div className="relative rounded-[2rem] border border-white/5 bg-slate-950/85 backdrop-blur-2xl shadow-2xl overflow-hidden">
              
              {/* Browser Header */}
              <div className="h-12 border-b border-slate-900 px-4 flex items-center justify-between bg-slate-900/30">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="px-6 py-1 bg-slate-900/90 rounded-md border border-slate-800/60 text-[10px] text-slate-500 font-mono tracking-tight select-none">
                  shivil.ai/dashboard
                </div>
                <div className="w-12" /> {/* spacer */}
              </div>

              {/* ERP Application Preview */}
              <div className="p-4 md:p-6 space-y-6">
                
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  
                  <div className="p-3 bg-slate-900/60 border border-slate-900 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Students</p>
                      <p className="text-lg font-bold text-white mt-0.5">12,450</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Users size={16} />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-900 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Faculty</p>
                      <p className="text-lg font-bold text-white mt-0.5">850</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <GraduationCap size={16} />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-900 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Courses</p>
                      <p className="text-lg font-bold text-white mt-0.5">150</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <BookOpen size={16} />
                    </div>
                  </div>

                </div>

                {/* Dashboard Chart Mock & Quick Calendar details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  
                  {/* SVG Chart Preview */}
                  <div className="md:col-span-8 p-4 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-white">Daily Attendance Ratio</p>
                        <p className="text-[10px] text-slate-400">Past 5 months average</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <TrendingUp size={14} />
                        <span>+2.4%</span>
                      </div>
                    </div>

                    {/* Chart Canvas */}
                    <div className="h-28 w-full relative pt-2">
                      <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1="0" y1="60" x2="300" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
                        
                        {/* Area Fill */}
                        <path 
                          d="M0,100 L0,70 Q45,35 90,65 T180,25 Q240,40 300,15 L300,100 Z" 
                          fill="url(#chartGlow)"
                        />
                        
                        {/* Line path */}
                        <path 
                          d="M0,70 Q45,35 90,65 T180,25 Q240,40 300,15" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="2.5" 
                        />
                        
                        {/* Bullet nodes */}
                        <circle cx="90" cy="65" r="3" fill="#60a5fa" stroke="#030712" strokeWidth="1" />
                        <circle cx="180" cy="25" r="3" fill="#a78bfa" stroke="#030712" strokeWidth="1" />
                        <circle cx="300" cy="15" r="4" fill="#a78bfa" stroke="#030712" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Quick Activity & Calendar Side panel */}
                  <div className="md:col-span-4 p-4 bg-slate-900/40 border border-slate-900 rounded-2xl flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white flex items-center gap-1">
                        <Calendar size={12} className="text-purple-400" />
                        <span>Today</span>
                      </p>
                      
                      <div className="mt-3 space-y-2.5">
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-900">
                          <p className="text-[10px] text-slate-400 font-semibold leading-none">09:00 AM</p>
                          <p className="text-[11px] text-white mt-1 leading-none font-medium">CS-101 Lecture</p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-900/60">
                          <p className="text-[10px] text-slate-500 font-semibold leading-none">02:00 PM</p>
                          <p className="text-[11px] text-slate-300 mt-1 leading-none font-medium">Senate Board</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Hostel status</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-semibold">92% Full</span>
                    </div>
                  </div>

                </div>

                {/* AI Assistant Simulated Box */}
                <div id="ai-demo" className="p-4 bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-500/20 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Bot size={14} className="animate-pulse" />
                    </div>
                    <span className="text-xs font-semibold text-white">SHIVIL AI Insight Console</span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-3 h-24 overflow-y-auto text-left">
                    <p className="text-[11px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {isTyping ? aiOutput + "▊" : aiOutput}
                    </p>
                  </div>

                  {/* Prompts list */}
                  <div className="space-y-1.5">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Quick Sandbox Queries</p>
                    <div className="flex flex-wrap gap-2">
                      {prompts.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePromptClick(p.text, p.reply)}
                          disabled={isTyping}
                          className="px-2.5 py-1 text-[10px] rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 transition disabled:opacity-50 text-left font-mono"
                        >
                          &gt; {p.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;
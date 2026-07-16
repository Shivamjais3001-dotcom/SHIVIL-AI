import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Check, 
  HelpCircle, 
  Activity, 
  Terminal, 
  Sliders, 
  Shield, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Volume2,
  Workflow,
  Building,
  GraduationCap,
  Users,
  AlertTriangle,
  Zap,
  Globe,
  Database
} from "lucide-react";

function Home() {
  const [activeDemoPrompt, setActiveDemoPrompt] = useState<string | null>(null);
  const [demoOutput, setDemoOutput] = useState<any | null>(null);
  const [isDemoTyping, setIsDemoTyping] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: "100K+", label: "Active Students Managed" },
    { value: "400ms", label: "Query response Latency" },
    { value: "94.2%", label: "AI Placement Prediction Accuracy" },
    { value: "22%", label: "Syllabus Compliance Improvement" }
  ];

  const features = [
    { 
      title: "University Command Center", 
      desc: "Bloomberg-style operational overview tracking GPA curves, budgets, and shortages.",
      icon: <Sliders className="text-blue-400" size={16} /> 
    },
    { 
      title: "Attendance Intelligence", 
      desc: "Daily check-in contribution heatmaps, duplicate IP fraud alerts, and eligibility lists.",
      icon: <Activity className="text-emerald-400" size={16} /> 
    },
    { 
      title: "Workflow Automation Studio", 
      desc: "Visually construct automated action paths linking triggers, conditions, and actions.",
      icon: <Workflow className="text-purple-400" size={16} /> 
    },
    { 
      title: "Autonomous AI Copilot", 
      desc: "Execute complex database searches, draft notices, and create timetables using speech.",
      icon: <Sparkles className="text-pink-400" size={16} /> 
    }
  ];

  const demoPrompts = [
    { label: "Predict Dropout Risk", query: "dropout" },
    { label: "Audit CSE Attendance", query: "attendance" },
    { label: "Generate Warning Notice", query: "warning" }
  ];

  const faqs = [
    { 
      q: "How does the AI Dropout Risk Model calculate probabilities?", 
      a: "The model integrates real-time class attendance logs, midterm grading curve deviations, and extracurricular skill matrices to compute cumulative risk indexes updated weekly." 
    },
    { 
      q: "Is student data protected under privacy compliance standards?", 
      a: "Yes, SHIVIL AI utilizes end-to-end encryption, IP-locked security clearances, SSO routing, and administrative audit logs fully compliant with education standards." 
    },
    { 
      q: "Can we connect existing LMS tools like Canvas or Moodle?", 
      a: "Yes, the Enterprise Admin Studio features toggle integrations to bridge Canvas logs, Slack channels, and SMTP notification dispatch APIs in minutes." 
    }
  ];

  const handleDemoTrigger = (query: string) => {
    setActiveDemoPrompt(query);
    setIsDemoTyping(true);
    setDemoOutput(null);

    setTimeout(() => {
      setIsDemoTyping(false);
      if (query === "dropout") {
        setDemoOutput({
          text: "🔮 AI projected risk index: 2.4% overall probability.",
          table: [
            { Student: "Neha Reddy", Risk: "88%", Reason: "Attendance shortfall" },
            { Student: "Anya Sen", Risk: "62%", Reason: "Syllabus delay" }
          ]
        });
      } else if (query === "attendance") {
        setDemoOutput({
          text: "📊 Attendance metrics categorized by branch check-ins:",
          table: [
            { Department: "Computer Science", Average: "94.2%", SHORTAGES: "1 Profile" },
            { Department: "Electrical Eng", Average: "88.0%", SHORTAGES: "2 Profiles" }
          ]
        });
      } else {
        setDemoOutput({
          text: "✉️ Warning letter template generated for parent dispatch:",
          code: "Subject: Urgent Attendance Warning\nDear Parent/Guardian,\nYour ward's attendance has dropped to 58%, which is below the mandatory 75% threshold."
        });
      }
    }, 1200);
  };

  return (
    <div className="bg-[#030712] min-h-screen text-slate-100 flex flex-col justify-between overflow-x-hidden select-none font-sans">
      
      {/* Landing Navbar */}
      <nav className="border-b border-white/5 bg-[#030712]/85 backdrop-blur-xl px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shrink-0">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white uppercase">SHIVIL AI</span>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/login"
            className="px-4.5 py-2 rounded-xl bg-slate-900 border border-white/5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-850 cursor-pointer transition shadow"
          >
            Access Terminal
          </Link>
        </div>
      </nav>

      {/* Main Sections */}
      <main className="flex-1 space-y-24 md:space-y-36 pb-20">
        
        {/* SECTION Hero */}
        <section className="relative pt-20 md:pt-28 text-center max-w-4xl mx-auto px-6 space-y-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
          
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-[10px] text-blue-400 font-bold uppercase tracking-wider select-none animate-pulse">
            <Sparkles size={11} />
            <span>The Intelligence Operating System for Universities</span>
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Legacy ERP meets <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Autonomous Intelligence
            </span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Consolidate student directories, faculty load distributions, and attendance checks inside a unified command center.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-3">
            <Link 
              to="/login"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-xs font-bold text-white shadow-xl shadow-blue-500/10 transition-all duration-300 hover:scale-[1.01] flex items-center gap-2"
            >
              <span>Launch Terminal</span>
              <ArrowRight size={13} />
            </Link>
            
            <a 
              href="#demo"
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-2"
            >
              <span>Explore AI Demo</span>
            </a>
          </div>
        </section>

        {/* SECTION KPI Metrics Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-2xl">
            {stats.map((st, i) => (
              <div key={i} className="text-center space-y-1.5">
                <p className="text-2xl md:text-3xl font-extrabold text-white font-mono leading-none">{st.value}</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{st.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION Interactive AI Demo */}
        <section id="demo" className="max-w-4xl mx-auto px-6 space-y-8 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-purple-400 font-bold">Interactive Sandbox</h2>
            <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Experience University Copilot</p>
            <p className="text-slate-400 text-xs leading-relaxed">Tap sample query prompts below to test our natural language database analyzer.</p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-950/50 backdrop-blur-xl p-5 md:p-6 shadow-2xl space-y-5">
            {/* Prompts list */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              {demoPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDemoTrigger(p.query)}
                  className={`px-4.5 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    activeDemoPrompt === p.query ? "bg-slate-900 border border-white/5 text-blue-400" : "bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Sandbox Console Screen */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 min-h-36 flex flex-col justify-center text-xs leading-relaxed font-mono relative">
              <span className="absolute top-3 left-4 flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
              </span>

              {isDemoTyping ? (
                <div className="flex gap-2 items-center text-slate-500 pl-2">
                  <Terminal size={14} className="animate-spin" />
                  <span className="animate-pulse">Processing query prompt...</span>
                </div>
              ) : demoOutput ? (
                <div className="space-y-4 pt-2">
                  <p className="text-slate-400 pl-1">{demoOutput.text}</p>
                  
                  {demoOutput.table && (
                    <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-950 p-1">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-slate-900/50 border-b border-slate-800 text-[9px] uppercase font-bold text-slate-500">
                            {Object.keys(demoOutput.table[0]).map((k, i) => (
                              <th key={i} className="p-2.5">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/50 text-white font-semibold">
                          {demoOutput.table.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-900/20">
                              {Object.values(row).map((val: any, k: number) => (
                                <td key={k} className="p-2.5">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {demoOutput.code && (
                    <div className="p-4.5 rounded-xl border border-slate-900 bg-slate-950 text-blue-400 font-mono text-[10px] overflow-x-auto select-text whitespace-pre">
                      {demoOutput.code}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-600 text-center select-none">
                  Console idle. Tap prompt card above to initialize simulation logs.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION Core Capabilities Features */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Portal Capabilities</h2>
            <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Automated Administration Operations</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div key={idx} className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 hover:border-slate-800 transition duration-300 space-y-4">
                <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-850 flex items-center justify-center">
                  {feat.icon}
                </span>
                <h3 className="text-sm font-bold text-white">{feat.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION Visual Workflow Builder Illustration */}
        <section className="max-w-4xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-purple-400 font-bold">Automation</h2>
            <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Visual Workflow Automation</p>
            <p className="text-slate-400 text-xs leading-relaxed">Set up triggers, conditions, and actions visually inside the drag-and-drop editor panel.</p>
          </div>

          <div className="p-6 md:p-8 rounded-[2rem] border border-white/5 bg-slate-950/40 backdrop-blur-2xl flex flex-col items-center space-y-4 relative">
            <div className="w-64 p-3.5 rounded-xl border border-red-500/25 bg-red-500/10 text-center">
              <span className="text-[9px] uppercase tracking-wider font-bold text-red-400 font-mono">Trigger</span>
              <p className="text-xs font-bold text-white mt-1">Attendance drops below 75%</p>
            </div>
            
            <div className="h-6 w-0.5 bg-gradient-to-b from-red-500/50 to-yellow-500/50" />

            <div className="w-64 p-3.5 rounded-xl border border-yellow-500/25 bg-yellow-500/10 text-center">
              <span className="text-[9px] uppercase tracking-wider font-bold text-yellow-400 font-mono">Condition</span>
              <p className="text-xs font-bold text-white mt-1">Is Student in CSE department?</p>
            </div>

            <div className="h-6 w-0.5 bg-gradient-to-b from-yellow-500/50 to-blue-500/50" />

            <div className="w-64 p-3.5 rounded-xl border border-blue-500/25 bg-blue-500/10 text-center">
              <span className="text-[9px] uppercase tracking-wider font-bold text-blue-400 font-mono">Action</span>
              <p className="text-xs font-bold text-white mt-1">Dispatch Alert Notice Parent</p>
            </div>
          </div>
        </section>

        {/* SECTION Pricing plans */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-blue-400 font-bold">Pricing Models</h2>
            <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Scalable Pricing for Institutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="p-8 rounded-[2rem] border border-white/5 bg-slate-950/40 backdrop-blur-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Starter Campus</h3>
                <p className="text-slate-400 text-xs">For regional colleges looking to modernise curriculum registries.</p>
                <h4 className="text-3xl font-extrabold text-white font-mono">$1,499<span className="text-xs text-slate-500">/month</span></h4>
                <ul className="space-y-3 border-t border-slate-900 pt-5 text-xs text-slate-400">
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Up to 2,000 active students</span></li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Standard registries directory</span></li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white text-center transition">
                Launch Trial
              </Link>
            </div>

            <div className="p-8 rounded-[2rem] border border-blue-500/30 bg-blue-950/5 shadow-[0_0_50px_rgba(59,130,246,0.1)] backdrop-blur-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Enterprise University</h3>
                <p className="text-slate-400 text-xs">For leading research universities requiring advanced NLP insights.</p>
                <h4 className="text-3xl font-extrabold text-white font-mono">$4,999<span className="text-xs text-slate-500">/month</span></h4>
                <ul className="space-y-3 border-t border-slate-900 pt-5 text-xs text-slate-400">
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Unlimited active students</span></li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Autonomous AI Assistant terminal</span></li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Workflow automation builders</span></li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs text-center transition shadow-lg shadow-blue-500/10">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION FAQs */}
        <section className="max-w-3xl mx-auto px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-pink-400 font-bold">FAQ</h2>
            <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Frequently Asked Queries</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center text-xs font-bold text-white text-left cursor-pointer focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </button>

                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-[11px] text-slate-500 leading-relaxed font-semibold mt-3 pt-3 border-t border-slate-900/60"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 bg-[#050814]/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-[10px]">
              S
            </div>
            <span>SHIVIL AI Operating System</span>
          </div>

          <div className="flex gap-4">
            <span className="hover:text-white transition duration-200">System Clearances</span>
            <span>•</span>
            <span className="hover:text-white transition duration-200">Security auditing</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;
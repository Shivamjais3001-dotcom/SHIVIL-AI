import { useState, useEffect, useMemo } from "react";
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
  Workflow, 
  Building, 
  GraduationCap, 
  Users, 
  AlertTriangle, 
  Zap, 
  Globe, 
  Database,
  Lock,
  Play,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Server
} from "lucide-react";

function Home() {
  const [activeDemoPrompt, setActiveDemoPrompt] = useState<string | null>(null);
  const [demoOutput, setDemoOutput] = useState<any | null>(null);
  const [isDemoTyping, setIsDemoTyping] = useState(false);
  const [typedQuery, setTypedQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [workflowStep, setWorkflowStep] = useState(0); // 0: Idle, 1: Trigger, 2: Condition, 3: Action Success
  const [isSimulatingWorkflow, setIsSimulatingWorkflow] = useState(false);

  // Stats data
  const stats = [
    { value: 1240, label: "Active Students Managed", prefix: "", suffix: "", trend: "+12%" },
    { value: 400, label: "Query response Latency", prefix: "~", suffix: "ms", trend: "-85%" },
    { value: 94.2, label: "Prediction Accuracy", prefix: "", suffix: "%", trend: "+4.1%" },
    { value: 22, label: "Syllabus Compliance", prefix: "+", suffix: "%", trend: "+9.2%" }
  ];

  const demoPrompts = [
    { label: "🔮 Predict Dropout Risk", query: "dropout", text: "Predict student dropout risk metrics in Computer Science Department." },
    { label: "📊 Audit CSE Attendance", query: "attendance", text: "Find and analyze student check-in records for Computer Science Section B." },
    { label: "✉️ Automate CSE Alert Notice", query: "warning", text: "Generate and schedule warning email notices for attendance shortages under 75%." }
  ];

  const faqs = [
    { 
      q: "How does the AI Dropout Risk Model calculate probabilities?", 
      a: "The model integrates real-time class attendance logs, midterm grading curve deviations, and extracurricular skill matrices to compute cumulative risk indexes updated weekly using our AI predictive analytics engine." 
    },
    { 
      q: "Is student data protected under privacy compliance standards?", 
      a: "Yes, SHIVIL AI utilizes end-to-end encryption, IP-locked security clearances, SSO routing, and administrative audit logs fully compliant with SOC 2 Type II, ISO 27001, and standard education privacy acts." 
    },
    { 
      q: "Can we connect existing LMS tools like Canvas or Moodle?", 
      a: "Yes, the Enterprise Admin Studio features toggle integrations to bridge Canvas logs, Slack channels, and SMTP notification dispatch APIs in minutes." 
    }
  ];

  // Mouse tilt handler for Parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = (clientX / width - 0.5) * 15; // range: -7.5 to 7.5
    const y = (clientY / height - 0.5) * 15;
    setMousePos({ x, y });
  };

  // Streaming text simulation for AI demo
  const runStreamingDemo = (query: string, promptText: string) => {
    setActiveDemoPrompt(query);
    setIsDemoTyping(true);
    setDemoOutput(null);
    setTypedQuery("");

    let currentText = "";
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < promptText.length) {
        currentText += promptText.charAt(charIndex);
        setTypedQuery(currentText);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsDemoTyping(false);

        // Display results depending on selection
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
      }
    }, 20);
  };

  // Workflow execution animation loop
  const triggerWorkflowSimulation = () => {
    if (isSimulatingWorkflow) return;
    setIsSimulatingWorkflow(true);
    setWorkflowStep(1); // Trigger active

    setTimeout(() => {
      setWorkflowStep(2); // Condition active
    }, 1200);

    setTimeout(() => {
      setWorkflowStep(3); // Action Success active
    }, 2400);

    setTimeout(() => {
      setWorkflowStep(0); // Reset
      setIsSimulatingWorkflow(false);
    }, 4500);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="bg-[#030712] min-h-screen text-slate-100 flex flex-col justify-between overflow-x-hidden select-none font-sans relative antialiased"
    >
      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Floating Animated Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-500/10 to-purple-600/10 blur-[120px] pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-[130px] pointer-events-none animate-pulse duration-[8s]" />

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#030712]/75 backdrop-blur-md px-6 md:px-12 py-4.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
            <Sparkles size={15} className="animate-pulse" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white uppercase">SHIVIL AI</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#problem" className="text-slate-400 hover:text-white text-xs font-bold transition">Problem</a>
          <a href="#features" className="text-slate-400 hover:text-white text-xs font-bold transition">Features</a>
          <a href="#demo" className="text-slate-400 hover:text-white text-xs font-bold transition">AI Sandbox</a>
          <a href="#automation" className="text-slate-400 hover:text-white text-xs font-bold transition">Workflows</a>
          <a href="#pricing" className="text-slate-400 hover:text-white text-xs font-bold transition">Pricing</a>
          <Link 
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white transition shadow-lg shadow-blue-500/15"
          >
            Access Terminal
          </Link>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 space-y-32 md:space-y-48 pb-24">
        
        {/* SECTION 1: Unforgettable Hero */}
        <section className="relative pt-24 md:pt-32 text-center max-w-6xl mx-auto px-6 space-y-12">
          {/* Background Glow */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full border border-blue-500/15 bg-blue-500/5 text-[10px] text-blue-400 font-extrabold uppercase tracking-widest"
            >
              <Sparkles size={12} className="animate-spin duration-1000" />
              <span>The Intelligence Operating System for Universities</span>
            </motion.span>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] select-none"
            >
              Legacy ERP meets <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Autonomous Intelligence
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-slate-400 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed"
            >
              Consolidate student directories, faculty load distributions, and attendance checks inside a unified command center. Automate compliance alerts and predict outcomes before they hit grading boards.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4.5 pt-4"
            >
              <Link 
                to="/login"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center gap-2 group"
              >
                <span>Launch Terminal</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a 
                href="#demo"
                className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-2"
              >
                <span>Explore AI Sandbox</span>
              </a>
            </motion.div>
          </div>

          {/* Interactive Live Dashboard Preview Panel with Parallax mouse tilt */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 0.2}deg) rotateY(${mousePos.x * 0.2}deg)`,
              transition: "transform 0.1s ease-out"
            }}
            className="w-full max-w-5xl mx-auto rounded-3xl border border-white/5 bg-slate-950/50 backdrop-blur-2xl p-6 shadow-[0_0_80px_rgba(59,130,246,0.1)] relative overflow-hidden"
          >
            {/* Glossy top outline */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            
            {/* Header / Top Bar */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
              <div className="flex gap-2 items-center">
                <span className="w-3 h-3 rounded-full bg-red-500/40" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <span className="w-3 h-3 rounded-full bg-green-500/40" />
                <span className="text-[10px] text-slate-500 font-mono ml-4">shivil-terminal-v1.0.0-beta</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-bold text-green-400 uppercase tracking-widest animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span>DB Engine: Active</span>
              </span>
            </div>

            {/* Dashboard Workspace Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
              {/* Left Navigation Widget */}
              <div className="space-y-4 rounded-2xl border border-white/5 bg-slate-900/30 p-4">
                <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 font-mono">Operations</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-500/10 border border-blue-500/15 text-[11px] font-bold text-blue-400">
                    <Sliders size={14} />
                    <span>University Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl text-[11px] text-slate-400 hover:text-slate-200 transition">
                    <Users size={14} />
                    <span>Student Registry</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl text-[11px] text-slate-400 hover:text-slate-200 transition">
                    <Building size={14} />
                    <span>Faculty Registry</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl text-[11px] text-slate-400 hover:text-slate-200 transition">
                    <Workflow size={14} />
                    <span>Automations</span>
                  </div>
                </div>
              </div>

              {/* Main Content Workspace Widgets */}
              <div className="md:col-span-3 space-y-6">
                {/* 3 Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-white/5 bg-slate-950/80 space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">Students Count</span>
                    <div className="flex justify-between items-end">
                      <p className="text-xl font-extrabold text-white font-mono">1,240</p>
                      <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <TrendingUp size={10} />
                        <span>+12%</span>
                      </span>
                    </div>
                    {/* Tiny Sparkline */}
                    <div className="h-6 w-full pt-1">
                      <svg className="w-full h-full stroke-emerald-500/40 fill-none" viewBox="0 0 100 20">
                        <path d="M0,15 Q10,12 20,8 T40,12 T60,6 T80,14 T100,2" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/5 bg-slate-950/80 space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">Attendance Rate</span>
                    <div className="flex justify-between items-end">
                      <p className="text-xl font-extrabold text-white font-mono">94.2%</p>
                      <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
                        <TrendingUp size={10} />
                        <span>+4.1%</span>
                      </span>
                    </div>
                    <div className="h-6 w-full pt-1">
                      <svg className="w-full h-full stroke-blue-500/40 fill-none" viewBox="0 0 100 20">
                        <path d="M0,18 Q15,10 30,12 T60,5 T90,8 T100,4" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/5 bg-slate-950/80 space-y-1">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">AI GPU Uptime</span>
                    <div className="flex justify-between items-end">
                      <p className="text-xl font-extrabold text-white font-mono">99.98%</p>
                      <span className="text-[9px] font-bold text-emerald-400">Stable</span>
                    </div>
                    <div className="h-6 w-full pt-1">
                      <svg className="w-full h-full stroke-indigo-500/40 fill-none" viewBox="0 0 100 20">
                        <path d="M0,10 Q20,10 40,10 T60,10 T80,10 T100,10" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sub layout: Mini timeline list & AI Panel preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-white/5 bg-slate-900/20 space-y-3">
                    <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 font-mono">Today's Class Schedule</p>
                    <div className="space-y-2 text-[10px]">
                      <div className="p-2.5 rounded-xl border border-white/5 bg-slate-950 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">Algorithms (CS-302)</p>
                          <p className="text-slate-500">Dr. Sarah Jenkins</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-mono">09:00 - 10:30</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-white/5 bg-slate-950 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">Neural Networks (AI-310)</p>
                          <p className="text-slate-500">Prof. Marcus Vance</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 font-mono">11:00 - 12:30</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/5 bg-slate-900/20 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 font-mono">Copilot prompt console</p>
                      <div className="p-2 rounded-xl bg-slate-950 font-mono text-[9px] text-blue-400 border border-slate-900 flex items-center gap-1.5">
                        <Terminal size={10} className="animate-pulse" />
                        <span>dropout --cse --section-b</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 text-[9px] font-mono text-slate-400 border border-slate-900 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[8px] uppercase tracking-wider text-pink-400 font-bold">
                        <Sparkles size={8} />
                        <span>AI Inference Response</span>
                      </div>
                      <p>Scanning check-in curves... 1 dropout hazard flag logged for Roll No APEX-2026-002.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro indicators scrolling link */}
            <div className="mt-8 flex justify-center items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              <span>Scroll to unfold Shivil Architecture</span>
              <ChevronDown size={12} className="animate-bounce" />
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: Problem Story (Legacy ERP limitations) */}
        <section id="problem" className="max-w-7xl mx-auto px-6 md:px-8 space-y-16 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-3.5">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">The Legacy Problem</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Fragile registries, fragmented data</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Modern universities run on data structures built in the 1990s. Administrative tasks remain manually operated, slow, and prone to critical bottlenecks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Legacy ERP Limitations Card */}
            <div className="p-8 md:p-10 rounded-3xl border border-red-500/10 bg-gradient-to-br from-red-500/[0.01] to-red-500/[0.04] space-y-6 relative overflow-hidden group hover:border-red-500/20 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Traditional ERP Barriers</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Traditional platforms require manual entries, lack intelligence integrations, and store files in isolated local spreadsheets.
              </p>
              <ul className="space-y-3.5 pt-2 text-xs text-slate-500 font-semibold">
                <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /><span>Fragmented spreadsheets & slow loading speeds</span></li>
                <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /><span>Isolated databases lacking predictive insight layers</span></li>
                <li className="flex items-center gap-2.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /><span>Manual dispatch systems for attendance warnings</span></li>
              </ul>
            </div>

            {/* AI Operating System Card */}
            <div className="p-8 md:p-10 rounded-3xl border border-blue-500/15 bg-gradient-to-br from-blue-500/[0.01] to-blue-500/[0.04] space-y-6 relative overflow-hidden group hover:border-blue-500/35 transition-all duration-300 shadow-[0_0_50px_rgba(59,130,246,0.05)]">
              {/* Highlight Glow line */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Sparkles size={20} className="animate-spin duration-1500" />
              </div>
              <h3 className="text-xl font-bold text-white">SHIVIL AI University OS</h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Consolidate workflows, analytics, and check-in logs into a unified, secure database infrastructure governed by AI.
              </p>
              <ul className="space-y-3.5 pt-2 text-xs text-slate-400 font-semibold">
                <li className="flex items-center gap-2.5"><Check size={14} className="text-blue-400" /><span>400ms query latency via global index caches</span></li>
                <li className="flex items-center gap-2.5"><Check size={14} className="text-blue-400" /><span>Continuous predictive model for dropout risks</span></li>
                <li className="flex items-center gap-2.5"><Check size={14} className="text-blue-400" /><span>Visual workflow builders linking triggers & notice dispatches</span></li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3: AI Operating System Core Features */}
        <section id="features" className="max-w-7xl mx-auto px-6 md:px-8 space-y-16 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto space-y-3.5">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest font-mono">Platform Capabilities</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Automated Administration</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 hover:border-blue-500/20 hover:bg-slate-950/60 transition-all duration-300 space-y-4 group">
              <span className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <Sliders size={18} />
              </span>
              <h3 className="text-sm font-extrabold text-white">University Command Center</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Bloomberg-style operational dashboard tracking class check-ins, faculty assignments, and GPA indexes.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 hover:border-emerald-500/20 hover:bg-slate-950/60 transition-all duration-300 space-y-4 group">
              <span className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Activity size={18} />
              </span>
              <h3 className="text-sm font-extrabold text-white">Attendance Intelligence</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Daily check-in contribution heatmaps, duplicate IP login prevention, and auto-attendance warning sheets.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 hover:border-purple-500/20 hover:bg-slate-950/60 transition-all duration-300 space-y-4 group">
              <span className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Workflow size={18} />
              </span>
              <h3 className="text-sm font-extrabold text-white">Workflow Studio</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Visually construct automated action paths linking registration status triggers and parental alerts.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 hover:border-pink-500/20 hover:bg-slate-950/60 transition-all duration-300 space-y-4 group">
              <span className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-850 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                <Sparkles size={18} />
              </span>
              <h3 className="text-sm font-extrabold text-white">Autonomous AI Assistant</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Execute database queries, extract warning lists, and compile report summaries via natural speech.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: Live AI Demonstration Sandbox */}
        <section id="demo" className="max-w-4xl mx-auto px-6 space-y-8 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto space-y-3.5">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest font-mono">Live Sandbox</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Interactive AI Console</h2>
            <p className="text-slate-400 text-xs leading-relaxed">Select a sample prompt trigger below to view our streaming query processor in action.</p>
          </div>

          <div className="rounded-3xl border border-white/5 bg-slate-950/60 backdrop-blur-2xl p-6 shadow-2xl space-y-6 relative">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />
            
            {/* Prompts list */}
            <div className="flex flex-wrap gap-3 justify-center">
              {demoPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => runStreamingDemo(p.query, p.text)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                    activeDemoPrompt === p.query ? "bg-slate-900 border border-pink-500/30 text-pink-400 shadow-lg shadow-pink-500/5" : "bg-slate-950 border border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Sandbox Console Screen */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 min-h-[160px] flex flex-col justify-center text-xs leading-relaxed font-mono relative overflow-hidden">
              <span className="absolute top-4 left-5 flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/25" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/25" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/25" />
              </span>

              {typedQuery && (
                <div className="border-b border-white/5 pb-3.5 mb-3.5 flex items-center gap-2 pl-1.5 text-blue-400">
                  <Terminal size={12} />
                  <span>{typedQuery}</span>
                  {isDemoTyping && <span className="w-1.5 h-3 bg-blue-400 animate-pulse inline-block" />}
                </div>
              )}

              {isDemoTyping && (
                <div className="flex gap-2 items-center text-slate-500 pl-2">
                  <span className="w-2.5 h-2.5 border-2 border-slate-600 border-t-pink-500 rounded-full animate-spin" />
                  <span className="animate-pulse">Synthesizing data models...</span>
                </div>
              )}

              {demoOutput && !isDemoTyping && (
                <div className="space-y-4 pt-1">
                  <div className="flex items-center gap-2 text-pink-400 font-extrabold text-[10px] uppercase tracking-wider">
                    <Sparkles size={11} />
                    <span>Inference output complete</span>
                  </div>
                  <p className="text-slate-300 pl-1 font-semibold">{demoOutput.text}</p>
                  
                  {demoOutput.table && (
                    <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-950 p-1">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-slate-900/40 border-b border-slate-900 text-[9px] uppercase font-bold text-slate-500">
                            {Object.keys(demoOutput.table[0]).map((k, i) => (
                              <th key={i} className="p-2.5">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/50 text-white font-semibold">
                          {demoOutput.table.map((row: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-900/20">
                              {Object.values(row).map((val: any, k: number) => (
                                <td key={k} className={`p-2.5 ${val.includes("88%") ? "text-red-400" : val.includes("94.2%") ? "text-emerald-400" : ""}`}>{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {demoOutput.code && (
                    <div className="p-4 rounded-xl border border-slate-900 bg-slate-950 text-indigo-400 font-mono text-[10px] overflow-x-auto select-text whitespace-pre">
                      {demoOutput.code}
                    </div>
                  )}
                </div>
              )}

              {!typedQuery && !demoOutput && (
                <p className="text-slate-600 text-center select-none">
                  Console idle. Tap a sandbox prompt to run the live query simulator.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 5: Visual Workflow Builder & Pulsing trigger animation */}
        <section id="automation" className="max-w-4xl mx-auto px-6 space-y-12 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto space-y-3.5">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest font-mono">Workflow Studio</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Active Automation Pipelines</h2>
            <p className="text-slate-400 text-xs leading-relaxed">Establish event listeners and auto-actions. Hit "Run Simulation" below to see data pulse down the pipeline.</p>
          </div>

          <div className="p-8 rounded-[2rem] border border-white/5 bg-slate-950/40 backdrop-blur-2xl flex flex-col items-center space-y-5 relative shadow-xl overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
            
            {/* Run button */}
            <button
              onClick={triggerWorkflowSimulation}
              disabled={isSimulatingWorkflow}
              className="absolute top-4 right-4 px-3.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-[10px] font-extrabold text-purple-400 uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
            >
              <Play size={10} className={isSimulatingWorkflow ? "animate-spin" : ""} />
              <span>{isSimulatingWorkflow ? "Running..." : "Run Simulation"}</span>
            </button>

            {/* Trigger node */}
            <div className={`w-72 p-4 rounded-2xl border text-center transition-all duration-300 ${
              workflowStep === 1 ? "border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "border-white/5 bg-slate-950/60 text-slate-400"
            }`}>
              <span className={`text-[8px] uppercase tracking-wider font-extrabold font-mono ${workflowStep === 1 ? "text-red-400" : "text-slate-500"}`}>1. System Trigger Event</span>
              <p className="text-xs font-extrabold text-white mt-1">Student Attendance Drops &lt; 75%</p>
            </div>
            
            {/* Connection Line 1 */}
            <div className="h-8 w-0.5 bg-slate-900 relative">
              {workflowStep === 1 && (
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-500 to-yellow-500 animate-pulse" />
              )}
            </div>

            {/* Condition node */}
            <div className={`w-72 p-4 rounded-2xl border text-center transition-all duration-300 ${
              workflowStep === 2 ? "border-yellow-500 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.2)]" : "border-white/5 bg-slate-950/60 text-slate-400"
            }`}>
              <span className={`text-[8px] uppercase tracking-wider font-extrabold font-mono ${workflowStep === 2 ? "text-yellow-400" : "text-slate-500"}`}>2. Conditional Check</span>
              <p className="text-xs font-extrabold text-white mt-1">Is Department equal to 'CSE'?</p>
            </div>

            {/* Connection Line 2 */}
            <div className="h-8 w-0.5 bg-slate-900 relative">
              {workflowStep === 2 && (
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-500 to-emerald-500 animate-pulse" />
              )}
            </div>

            {/* Action node */}
            <div className={`w-72 p-4 rounded-2xl border text-center transition-all duration-300 ${
              workflowStep === 3 ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "border-white/5 bg-slate-950/60 text-slate-400"
            }`}>
              <span className={`text-[8px] uppercase tracking-wider font-extrabold font-mono ${workflowStep === 3 ? "text-emerald-400" : "text-slate-500"}`}>3. Executing Action</span>
              <p className="text-xs font-extrabold text-white mt-1">Dispatch Warning Notice to Parent</p>
            </div>
          </div>
        </section>

        {/* SECTION 6: Key Statistics and metrics */}
        <section className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-[2rem] border border-white/5 bg-slate-950/40 backdrop-blur-2xl">
            {stats.map((st, i) => (
              <div key={i} className="text-center p-4 space-y-2 border-r border-white/5 last:border-0">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">{st.label}</span>
                <div className="flex justify-center items-baseline gap-1">
                  <span className="text-slate-500 text-sm font-bold font-mono">{st.prefix}</span>
                  <span className="text-3xl md:text-4xl font-extrabold text-white font-mono">{st.value}</span>
                  <span className="text-slate-500 text-xs font-bold font-mono">{st.suffix}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                  <TrendingUp size={10} />
                  <span>{st.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: Security & Compliance badges */}
        <section className="max-w-5xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-3.5">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">Auditing & Security</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Enterprise Infrastructure Trust</h2>
            <p className="text-slate-400 text-xs leading-relaxed">Protecting core institutional data stores is our primary directive. Clearances are updated continuously.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/60 flex flex-col items-center justify-center space-y-3 text-center">
              <Shield size={24} className="text-blue-400" />
              <div>
                <p className="text-xs font-extrabold text-white">ISO 27001</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Certified</p>
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/60 flex flex-col items-center justify-center space-y-3 text-center">
              <Lock size={24} className="text-purple-400" />
              <div>
                <p className="text-xs font-extrabold text-white">SOC 2 Type II</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Audited</p>
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/60 flex flex-col items-center justify-center space-y-3 text-center">
              <Database size={24} className="text-emerald-400" />
              <div>
                <p className="text-xs font-extrabold text-white">GDPR Compliant</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Privacy Guarded</p>
              </div>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/60 flex flex-col items-center justify-center space-y-3 text-center">
              <Server size={24} className="text-pink-400" />
              <div>
                <p className="text-xs font-extrabold text-white">E2E Encrypted</p>
                <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5">Tunnel IP Locked</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: Universities & Social Proof */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Academic Endorsements</span>
            <p className="text-xl font-extrabold text-slate-400">Trusted by modern research facilities and pilot campuses</p>
          </div>

          {/* Carousel Grid layout of University names */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center min-h-16">
              Massachusetts Inst.
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center min-h-16">
              Stanford Pilot
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center min-h-16">
              Oxford Tech
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center min-h-16">
              Shivil Tech Institute
            </div>
          </div>
        </section>

        {/* SECTION 9: Client Testimonials */}
        <section className="max-w-6xl mx-auto px-6 md:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3.5">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest font-mono">Testimonials</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Valued by University Administrators</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4">
              <div className="flex text-yellow-400 gap-1"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
              <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                "Shivil OS replaced our legacy registry stack in 3 days. Automated attendance dispatches have reduced student compliance shortages by 22%."
              </p>
              <div>
                <p className="text-xs font-bold text-white">Dr. Sarah Jenkins</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Computer Science Dean</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4">
              <div className="flex text-yellow-400 gap-1"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
              <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                "The Bloomberg-style command center aggregates student metrics instantly. We track risk indexes live, saving hundreds of administration hours weekly."
              </p>
              <div>
                <p className="text-xs font-bold text-white">Prof. Marcus Vance</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Academic Administrator</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 space-y-4">
              <div className="flex text-yellow-400 gap-1"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
              <p className="text-slate-400 text-xs leading-relaxed font-semibold">
                "The visual workflow builder connects our database to SMTP dispatches perfectly. It makes running campus operations feel modern and fast."
              </p>
              <div>
                <p className="text-xs font-bold text-white">Arjun Sharma</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Registrar Associate</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: Pricing models & highlight recommended plan */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 md:px-8 space-y-16 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto space-y-3.5">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">Pricing Models</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">Subscription Structures</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="p-8 rounded-[2rem] border border-white/5 bg-slate-950/40 backdrop-blur-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Starter Campus</h3>
                <p className="text-slate-400 text-xs">For regional colleges looking to modernise curriculum registries and attendance checks.</p>
                <h4 className="text-3xl font-extrabold text-white font-mono">$1,499<span className="text-xs text-slate-500">/month</span></h4>
                <ul className="space-y-3.5 border-t border-slate-900/50 pt-5 text-xs text-slate-400">
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Up to 2,000 active students</span></li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Standard registries directory</span></li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Standard attendance heatmaps</span></li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white text-center transition">
                Launch Trial
              </Link>
            </div>

            {/* Enterprise Plan (Recommended & Highlighted with glow) */}
            <div className="p-8 rounded-[2rem] border border-blue-500/30 bg-blue-950/5 shadow-[0_0_50px_rgba(59,130,246,0.1)] backdrop-blur-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
              <span className="absolute top-4 right-4 px-2 py-0.5 rounded bg-blue-500/10 text-[8px] font-extrabold text-blue-400 uppercase tracking-widest border border-blue-500/20">Recommended</span>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Enterprise University</h3>
                <p className="text-slate-400 text-xs">For leading research universities requiring advanced NLP copilot queries and automated action paths.</p>
                <h4 className="text-3xl font-extrabold text-white font-mono">$4,999<span className="text-xs text-slate-500">/month</span></h4>
                <ul className="space-y-3.5 border-t border-slate-900/50 pt-5 text-xs text-slate-400">
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Unlimited active students</span></li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Autonomous AI Assistant terminal</span></li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Visual workflow automation builders</span></li>
                  <li className="flex items-center gap-2"><Check size={12} className="text-blue-400" /><span>Priority 24/7 engineering SLA</span></li>
                </ul>
              </div>
              <Link to="/login" className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs text-center transition shadow-lg shadow-blue-500/10">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 11: FAQs */}
        <section className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3.5">
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest font-mono">FAQ</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Queries</h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4.5 rounded-2xl bg-slate-950 border border-slate-900 overflow-hidden transition-colors hover:border-slate-800">
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

        {/* SECTION 12: CTA (Call to action) */}
        <section className="max-w-4xl mx-auto px-6">
          <div className="p-8 md:p-12 rounded-[2.5rem] border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.01] to-purple-600/[0.05] text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl pointer-events-none" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">Ready to deploy?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">Bring autonomous operational speed to your university today</h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
              Unlock a single source of truth for registries, compliance warnings, and workloads inside a secure, containerized, and certified network environment.
            </p>
            <div className="pt-2">
              <Link 
                to="/login"
                className="inline-flex px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-xl transition-all duration-300 hover:scale-[1.01]"
              >
                Launch Staging Sandbox
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Expanded Enterprise Footer */}
      <footer className="border-t border-white/5 pt-16 pb-12 bg-[#050814]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs leading-relaxed font-medium">
          
          {/* Column 1 Logo & pitch */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-[10px]">
                S
              </div>
              <span className="font-extrabold text-sm tracking-tight text-white uppercase">SHIVIL AI</span>
            </div>
            <p className="text-slate-500 max-w-sm text-[11px] leading-relaxed font-semibold">
              The autonomous operating system for modern universities, streamlining directories, predictive drop-out calculations, and class attendances.
            </p>
            <p className="text-slate-600 text-[10px] font-semibold">
              © 2026 SHIVIL AI Inc. All clearances active.
            </p>
          </div>

          {/* Column 2 Product links */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-white font-mono">Product</p>
            <ul className="space-y-2 text-slate-500 font-semibold">
              <li><Link to="/login" className="hover:text-white transition">Dashboard</Link></li>
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#demo" className="hover:text-white transition">AI Console</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
            </ul>
          </div>

          {/* Column 3 Resources links */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-white font-mono">Resources</p>
            <ul className="space-y-2 text-slate-500 font-semibold">
              <li><span className="hover:text-white transition cursor-pointer">Documentation</span></li>
              <li><span className="hover:text-white transition cursor-pointer">API Reference</span></li>
              <li><span className="hover:text-white transition cursor-pointer">System Status</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Roadmap Updates</span></li>
            </ul>
          </div>

          {/* Column 4 Corporate links */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-white font-mono">Clearances</p>
            <ul className="space-y-2 text-slate-500 font-semibold">
              <li><span className="hover:text-white transition cursor-pointer">SOC 2 Registry</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Contact Clearance</span></li>
            </ul>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Home;
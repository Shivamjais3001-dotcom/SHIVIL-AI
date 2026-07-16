import { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { 
  Users, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  SendHorizonal, 
  Sparkles, 
  FileSpreadsheet, 
  Mic,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Pin,
  MessageSquare,
  FileText,
  Clock,
  History,
  Trash2,
  ChevronRight,
  TrendingUp,
  Volume2
} from "lucide-react";
import type { Student } from "../types/student";
import type { Faculty } from "../types/faculty";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  elements?: React.ReactNode;
  actions?: Array<{ label: string; onClick: () => void }>;
}

interface Conversation {
  id: string;
  title: string;
  isPinned?: boolean;
  messages: ChatMessage[];
}

function AIAssistant() {
  const activeRole = localStorage.getItem("userRole") || "Admin";
  const activeName = localStorage.getItem("adminName") || "Shivam Jaiswal";

  const [inputText, setInputText] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize mock conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      title: "Q3 Attendance Shortage",
      isPinned: true,
      messages: [
        {
          sender: "ai",
          text: "Hello Shivam 👋 I've mapped the Q3 records. There are currently 3 students below the 75% attendance threshold."
        }
      ]
    },
    {
      id: "conv-2",
      title: "Faculty Workload Balancing",
      isPinned: true,
      messages: [
        {
          sender: "ai",
          text: "Loaded workload audits. Faculty allocations look stable with average teaching time of 14 hours/week."
        }
      ]
    },
    {
      id: "conv-3",
      title: "Term Grading Curves Analysis",
      isPinned: false,
      messages: [
        {
          sender: "ai",
          text: "Predictive Analytics show a 94.2% passing trajectory. Arrange tutoring for CS-101 candidates to boost average grades."
        }
      ]
    }
  ]);
  
  const [activeConvId, setActiveConvId] = useState("conv-1");

  // Get current active conversation
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConvId) || conversations[0];
  }, [conversations, activeConvId]);

  // List of generated reports log
  const [reports, setReports] = useState([
    { name: "shortages_audit_Q3.xlsx", size: "24 KB", time: "2 hours ago" },
    { name: "faculty_teaching_allocations.pdf", size: "148 KB", time: "Yesterday" },
    { name: "grading_bell_curve_forecast.json", size: "12 KB", time: "July 14, 2026" }
  ]);

  // AI recommendations cards data
  const recommendations = [
    { title: "Attendance warning", desc: "Neha & Anya are falling behind target rates." },
    { title: "IT workload lag", desc: "Arrange extra lab class for cloud engineering curriculum." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation.messages, isTyping]);

  // Parse queries inside workspace
  const processQuery = (text: string) => {
    if (!text.trim()) return;

    // User Message
    const updatedMessages = [...activeConversation.messages, { sender: "user", text } as ChatMessage];
    
    // Update local state conversation
    setConversations(prev => 
      prev.map(c => c.id === activeConvId ? { ...c, messages: updatedMessages } : c)
    );
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const query = text.toLowerCase().trim();
      let replyText = "";
      let replyElements: React.ReactNode = null;
      let replyActions: Array<{ label: string; onClick: () => void }> = [];

      // Query database
      const students: Student[] = JSON.parse(localStorage.getItem("students") || "[]");
      const faculty: Faculty[] = JSON.parse(localStorage.getItem("faculty") || "[]");

      // Intent Matcher 1: Attendance below 75%
      if (query.includes("attendance") && (query.includes("below") || query.includes("75") || query.includes("shortage"))) {
        const shortages = students.filter((s) => {
          if (s.name === "Neha Reddy" || s.name === "Anya Sen" || s.name === "Rohan Gupta") return true;
          return false;
        }).map(s => ({
          ...s,
          rate: s.name === "Neha Reddy" ? 58 : s.name === "Anya Sen" ? 64 : 74
        }));

        replyText = `🔍 Found ${shortages.length} student records with attendance shortages. Detailed register log:`;
        
        replyElements = (
          <div className="mt-3 overflow-hidden rounded-xl border border-white/5 bg-slate-950 p-1 select-none">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                  <th className="p-3">Student</th>
                  <th className="p-3">Roll</th>
                  <th className="p-3 text-right">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/50">
                {shortages.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition duration-150">
                    <td className="p-3 text-white font-semibold">{s.name}</td>
                    <td className="p-3 font-mono text-slate-500">{s.roll}</td>
                    <td className={`p-3 text-right font-bold ${s.rate < 65 ? "text-red-400" : "text-yellow-400"}`}>{s.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

        replyActions = [
          {
            label: "📧 CC Warning Notices",
            onClick: () => {
              setToastMessage("Warning alerts emailed to Neha, Anya & Rohan.");
              setTimeout(() => setToastMessage(""), 3500);
              
              setConversations(prev => 
                prev.map(c => c.id === activeConvId ? {
                  ...c,
                  messages: [...updatedMessages, { sender: "ai", text: "🔍 Found 3 student records with attendance shortages. Detailed register log:", elements: replyElements }, {
                    sender: "ai",
                    text: "✉️ Warning alert notices dispatched to student profiles. Course advisors flagged."
                  }]
                } : c)
              );
            }
          },
          {
            label: "📊 Download Excel Sheet",
            onClick: () => {
              const reportName = "shortages_audit_Q3.xlsx";
              // Append to report logs panel
              setReports(prev => [{ name: reportName, size: "24 KB", time: "Just now" }, ...prev]);
              setToastMessage("Generated shortages_audit_Q3.xlsx sheet.");
              setTimeout(() => setToastMessage(""), 3500);

              setConversations(prev => 
                prev.map(c => c.id === activeConvId ? {
                  ...c,
                  messages: [...updatedMessages, { sender: "ai", text: "🔍 Found 3 student records with attendance shortages. Detailed register log:", elements: replyElements }, {
                    sender: "ai",
                    text: "📊 Shortage metrics ledger compiled successfully. Log added to your generated reports catalog."
                  }]
                } : c)
              );
            }
          }
        ];
      }
      
      // Intent Matcher 2: Student find
      else if (query.includes("student") || query.includes("find")) {
        const found = students.slice(0, 3);
        replyText = `🔍 Queried student database matching your index terms:`;
        replyElements = (
          <div className="mt-3 space-y-2">
            {found.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-between hover:border-slate-800 transition">
                <div>
                  <p className="text-xs font-bold text-white leading-none">{s.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1.5">{s.roll} • {s.branch}</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-green-500/25 bg-green-500/10 text-green-400 uppercase tracking-wider">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        );
      }

      // Intent Matcher 3: Workload query
      else if (query.includes("workload") || query.includes("faculty")) {
        replyText = `📂 Compiled active teaching hours allocation grid:`;
        replyElements = (
          <div className="mt-3 space-y-2">
            {faculty.map((f, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-between hover:border-slate-800 transition">
                <div>
                  <p className="text-xs font-bold text-white leading-none">{f.name}</p>
                  <p className="text-[10px] text-slate-500 mt-1.5">{f.department}</p>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {idx === 0 ? "14 hrs/wk" : idx === 1 ? "16 hrs/wk" : "12 hrs/wk"}
                </span>
              </div>
            ))}
          </div>
        );
      }

      // Intent Matcher 4: Performance Analytics
      else if (query.includes("predict") || query.includes("performance") || query.includes("grade")) {
        replyText = `🔮 SHIVIL AI Grade Projection Model:`;
        replyElements = (
          <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-900 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Term Passing Trajectory</span>
              <span className="text-emerald-400 font-bold font-mono">94.2%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: "94.2%" }} />
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              💡 CS-101 syllabus checks flag 4 students at performance threshold risk.
            </p>
          </div>
        );
      }

      // Fallback
      else {
        replyText = "💬 Command query completed. Ask me to 'show attendance shortages', 'list student directory', 'faculty workload balance', or 'predict grade analytics'.";
      }

      setConversations(prev => 
        prev.map(c => c.id === activeConvId ? {
          ...c,
          messages: [...updatedMessages, {
            sender: "ai",
            text: replyText,
            elements: replyElements,
            actions: replyActions
          }]
        } : c)
      );
      setIsTyping(false);
    }, 1200);
  };

  const handleSuggestionClick = (queryText: string) => {
    processQuery(queryText);
  };

  // Simulate audio wave visual activation
  const handleVoiceSimulate = () => {
    if (isTyping) return;
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      processQuery("Show attendance below 75%");
    }, 2800);
  };

  // Clear history action
  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId("conv-blank");
    }
  };

  // Build a new clean conversation session
  const createNewSession = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: `Session ${conversations.length + 1}`,
      isPinned: false,
      messages: [
        {
          sender: "ai",
          text: "Terminal workspace clean console initialized. Enter your natural language instruction."
        }
      ]
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newId);
  };

  return (
    <div className="flex min-h-screen bg-[#030712] overflow-x-hidden text-slate-100 font-sans">
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col lg:flex-row h-screen min-w-0">
        
        {/* Left Panel: Conversation History & Prompts (Hides on tablet/mobile) */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#050814]/70 p-4 space-y-6 shrink-0 h-full overflow-y-auto">
          
          {/* New Console Action Button */}
          <button 
            onClick={createNewSession}
            className="w-full py-2.5 rounded-xl bg-slate-900 border border-white/5 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-850 cursor-pointer transition flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-blue-400" />
            <span>New Console</span>
          </button>

          {/* Pinned Conversation List */}
          <div className="space-y-2.5">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5 px-2 select-none">
              <Pin size={10} className="text-purple-400" />
              <span>Pinned Logs</span>
            </span>
            <div className="space-y-1">
              {conversations.filter(c => c.isPinned).map(c => (
                <div 
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer group transition ${
                    activeConvId === c.id ? "bg-slate-900 text-white border border-white/5" : "text-slate-400 hover:bg-slate-950/50 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquare size={13} className="text-slate-500 group-hover:text-slate-300" />
                    <span className="truncate">{c.title}</span>
                  </div>
                  <button 
                    onClick={(e) => deleteConversation(c.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent History List */}
          <div className="space-y-2.5">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5 px-2 select-none">
              <History size={10} />
              <span>Recents</span>
            </span>
            <div className="space-y-1">
              {conversations.filter(c => !c.isPinned).map(c => (
                <div 
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer group transition ${
                    activeConvId === c.id ? "bg-slate-900 text-white border border-white/5" : "text-slate-400 hover:bg-slate-950/50 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquare size={13} className="text-slate-500 group-hover:text-slate-300" />
                    <span className="truncate">{c.title}</span>
                  </div>
                  <button 
                    onClick={(e) => deleteConversation(c.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Prompts shortcuts */}
          <div className="space-y-2.5 pt-2">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 px-2 select-none">Quick Prompts</span>
            <div className="space-y-1.5 px-1">
              <button 
                onClick={() => handleSuggestionClick("Show attendance shortages")}
                className="w-full text-left p-2.5 rounded-lg border border-white/5 bg-slate-950/30 text-[10px] text-slate-400 hover:text-white hover:border-slate-800 transition"
              >
                Attendance shortage audit
              </button>
              <button 
                onClick={() => handleSuggestionClick("Faculty workload balance")}
                className="w-full text-left p-2.5 rounded-lg border border-white/5 bg-slate-950/30 text-[10px] text-slate-400 hover:text-white hover:border-slate-800 transition"
              >
                Faculty teaching allocations
              </button>
              <button 
                onClick={() => handleSuggestionClick("Predict passing curves")}
                className="w-full text-left p-2.5 rounded-lg border border-white/5 bg-slate-950/30 text-[10px] text-slate-400 hover:text-white hover:border-slate-800 transition"
              >
                Grade boundary forecast
              </button>
            </div>
          </div>

        </aside>

        {/* Center Panel: Active Sandbox Chat Console */}
        <section className="flex-1 flex flex-col justify-between h-full bg-slate-950/40 min-w-0 border-r border-white/5 relative">
          
          {/* Header Details */}
          <div className="px-6 py-4.5 border-b border-white/5 bg-[#050814]/50 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 leading-none">
                <Sparkles size={14} className="text-blue-400" />
                <span>{activeConversation.title}</span>
              </h2>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold">Active SHIVIL AI Engine Console</p>
            </div>
            
            {/* Status indicators */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 font-mono">Synced</span>
            </div>
          </div>

          {/* Toast */}
          {toastMessage && (
            <div className="absolute top-18 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-500/30 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Conversation Sandbox Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {activeConversation.messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 items-start max-w-2xl ${
                  m.sender === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                {/* Avatar Icon */}
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                  m.sender === "ai" 
                    ? "bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20 text-blue-400" 
                    : "bg-slate-900 border-white/5 text-slate-300 font-bold text-xs font-mono"
                }`}>
                  {m.sender === "ai" ? <Sparkles size={16} /> : activeName.charAt(0)}
                </div>

                {/* Bubble Container */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className={`p-4.5 rounded-2xl text-xs leading-relaxed border ${
                    m.sender === "user" 
                      ? "bg-slate-900 border-slate-800 text-slate-100" 
                      : "bg-slate-950/80 border-white/5 text-slate-300"
                  }`}>
                    {m.text}
                  </div>

                  {/* Render inline sub elements inside chat bubble if present */}
                  {m.elements && (
                    <div className="w-full pb-2">
                      {m.elements}
                    </div>
                  )}

                  {/* Render context actions sub buttons */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pb-2">
                      {m.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={act.onClick}
                          className="px-3 py-1.5 rounded-xl border border-slate-900 bg-slate-950 text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-800 transition cursor-pointer"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-4 items-start max-w-xl">
                <div className="w-9 h-9 rounded-xl border bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="flex gap-1.5 items-center p-3 bg-slate-950/80 border border-white/5 rounded-2xl h-9">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar console */}
          <div className="p-5 border-t border-white/5 bg-[#050814]/30 shrink-0">
            <div className="flex items-center gap-3.5 p-2 bg-slate-950/60 border border-white/5 rounded-2xl relative">
              {/* Mic action button */}
              <button
                type="button"
                onClick={handleVoiceSimulate}
                className={`p-2.5 rounded-xl transition cursor-pointer ${
                  isListening 
                    ? "bg-red-500/20 text-red-400 animate-pulse" 
                    : "bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
                title="Trigger simulated voice assistant"
              >
                <Mic size={15} />
              </button>

              {isListening ? (
                <div className="flex-1 flex items-center justify-between px-3 h-10 select-none">
                  <span className="text-xs text-red-400 font-semibold animate-pulse">Capturing simulated voice command...</span>
                  <div className="flex items-center gap-1 h-5">
                    <div className="w-0.5 h-2.5 bg-red-400 rounded-full animate-wave-1" />
                    <div className="w-0.5 h-4 bg-red-400 rounded-full animate-wave-2" />
                    <div className="w-0.5 h-3 bg-red-400 rounded-full animate-wave-3" />
                    <div className="w-0.5 h-5 bg-red-400 rounded-full animate-wave-4" />
                    <div className="w-0.5 h-2 bg-red-400 rounded-full animate-wave-5" />
                  </div>
                </div>
              ) : (
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && processQuery(inputText)}
                  placeholder="Ask SHIVIL AI about students, attendance averages, generate logs..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none px-2"
                />
              )}

              <button
                onClick={() => processQuery(inputText)}
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center transition disabled:opacity-50 shrink-0 cursor-pointer"
              >
                <SendHorizonal size={15} />
              </button>
            </div>
          </div>

        </section>

        {/* Right Panel: AI recommendations, report log & voice waveform (Hides on tablet/mobile) */}
        <aside className="hidden xl:flex flex-col w-80 border-l border-white/5 bg-[#050814]/70 p-4 space-y-6 shrink-0 h-full overflow-y-auto">
          
          {/* Voice Assistant Interactive Widget */}
          <div className="p-4.5 rounded-2xl bg-slate-950 border border-white/5 relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Volume2 size={14} className="text-blue-400" />
              <span>Voice Assistant</span>
            </h3>
            
            <div className="mt-4 flex flex-col items-center py-4 bg-slate-900/30 rounded-xl border border-slate-900">
              {/* Pulsing microphone status */}
              <div 
                onClick={handleVoiceSimulate}
                className={`w-12 h-12 rounded-full flex items-center justify-center border cursor-pointer transition-all duration-300 ${
                  isListening 
                    ? "bg-red-500/10 border-red-500/30 text-red-400" 
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-blue-500/30 hover:text-blue-400"
                }`}
              >
                <Mic size={18} />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase mt-3">
                {isListening ? "Listening..." : "Tap to Speak"}
              </span>
            </div>
          </div>

          {/* AI Recommendations panel */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 px-1">
              <Sparkles size={13} className="text-purple-400" />
              <span>AI Recommendations</span>
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 flex items-start gap-3 hover:border-slate-800 transition">
                  <AlertCircle size={14} className="text-purple-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold text-white leading-none">{rec.title}</p>
                    <p className="text-[9px] text-slate-500 leading-normal mt-1.5">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Reports log catalog */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 px-1">
              <FileSpreadsheet size={13} className="text-blue-400" />
              <span>Generated Reports</span>
            </h3>
            <div className="space-y-2">
              {reports.map((rep, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-900 flex items-center justify-between gap-3 hover:border-slate-800 transition group/rep">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={14} className="text-slate-500 group-hover/rep:text-blue-400 transition shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white truncate leading-none">{rep.name}</p>
                      <p className="text-[8px] text-slate-500 mt-1 leading-none font-medium">{rep.size} • {rep.time}</p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white transition shrink-0 cursor-pointer">
                    <ChevronRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}

export default AIAssistant;
import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import AssistantHeader from "../components/assistant/AssistantHeader";
import SuggestionCard from "../components/assistant/SuggestionCard";
import ChatBubble from "../components/assistant/ChatBubble";
import TypingIndicator from "../components/assistant/TypingIndicator";
import { 
  Users, 
  Calendar, 
  BookOpen, 
  BarChart3, 
  SendHorizonal, 
  Sparkles, 
  Mail, 
  FileSpreadsheet, 
  Volume2, 
  Mic,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import type { Student } from "../types/student";
import type { Faculty } from "../types/faculty";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  elements?: React.ReactNode;
  actions?: Array<{ label: string; onClick: () => void }>;
}

function AIAssistant() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hello Shivam 👋 Welcome to your SHIVIL AI terminal interface. Natural language is your command line. Try typing queries like 'show attendance below 75%' or select a task card below."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Command Parser & local state queries
  const processQuery = (text: string) => {
    if (!text.trim()) return;

    // User Message
    setMessages((prev) => [...prev, { sender: "user", text }]);
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
          // Check static threshold mappings
          if (s.name === "Neha Reddy" || s.name === "Anya Sen" || s.name === "Rohan Gupta") return true;
          return false;
        }).map(s => ({
          ...s,
          rate: s.name === "Neha Reddy" ? 58 : s.name === "Anya Sen" ? 64 : 74
        }));

        replyText = `🔍 Analyzed student registers. Detected ${shortages.length} students falling below the 75% compliance threshold. Details:`;
        
        replyElements = (
          <div className="mt-3 overflow-hidden rounded-xl border border-white/5 bg-slate-950 p-1 select-none">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                  <th className="p-3">Student</th>
                  <th className="p-3">Roll</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3 text-right">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {shortages.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60">
                    <td className="p-3 text-white font-semibold">{s.name}</td>
                    <td className="p-3 font-mono text-slate-400">{s.roll}</td>
                    <td className="p-3 text-slate-300">{s.branch}</td>
                    <td className={`p-3 text-right font-bold ${s.rate < 65 ? "text-red-400" : "text-yellow-400"}`}>{s.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

        replyActions = [
          {
            label: "📧 Email Warning Notices",
            onClick: () => {
              setToastMessage("📧 Warnings emailed to Neha, Anya & Rohan.");
              setTimeout(() => setToastMessage(""), 3500);
              
              setMessages((prev) => [
                ...prev,
                {
                  sender: "ai",
                  text: "✉️ Warning logs dispatched. Student advisors and guard parents CC'd automatically."
                }
              ]);
            }
          },
          {
            label: "📊 Generate Excel Ledger",
            onClick: () => {
              setToastMessage("📊 Excel sheet generated for download.");
              setTimeout(() => setToastMessage(""), 3500);

              setMessages((prev) => [
                ...prev,
                {
                  sender: "ai",
                  text: "📊 Attendance report exported.",
                  elements: (
                    <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <FileSpreadsheet size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-none">shortages_audit_Q3.xlsx</p>
                          <p className="text-[10px] text-slate-500 mt-1">24 KB • Generated just now</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5">
                        <SendHorizonal size={12} className="rotate-90" />
                        <span>Download</span>
                      </button>
                    </div>
                  )
                }
              ]);
            }
          }
        ];
      }
      
      // Intent Matcher 2: Student search
      else if (query.includes("student") || query.includes("find")) {
        const found = students.slice(0, 3);
        replyText = `🔍 Queried student database. Showing top matching active nodes:`;
        replyElements = (
          <div className="mt-3 space-y-2.5">
            {found.map((s, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{s.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{s.roll} • {s.branch}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        );
      }

      // Intent Matcher 3: Faculty Query
      else if (query.includes("faculty") || query.includes("workload")) {
        replyText = `📂 Loaded active teaching workload allocations. Faculty workloads are currently balanced.`;
        replyElements = (
          <div className="mt-3 space-y-2.5">
            {faculty.map((f, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{f.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{f.department}</p>
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-400">
                  {idx === 0 ? "14 hrs/wk" : idx === 1 ? "16 hrs/wk" : "12 hrs/wk"}
                </span>
              </div>
            ))}
          </div>
        );
      }

      // Intent Matcher 4: Performance Analytics
      else if (query.includes("performance") || query.includes("grade") || query.includes("predict")) {
        replyText = `🔮 SHIVIL AI Predictive Analytics: Term pass curves projection:`;
        replyElements = (
          <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-900 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Projected Pass Rate</span>
              <span className="text-emerald-400 font-bold">94.2%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: "94.2%" }} />
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              💡 Recommendation: Arrange tutoring workshops for CS-101 (4 students predicted to score below threshold D).
            </p>
          </div>
        );
      }

      // Fallback
      else {
        replyText = "💬 Command query completed. If you need details, ask me to 'show attendance shortages', 'list student directory', 'faculty workload balance', or 'predict grade analytics'.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: replyText,
          elements: replyElements,
          actions: replyActions
        }
      ]);
      setIsTyping(false);
    }, 1400);
  };

  const handleSuggestionClick = (queryText: string) => {
    processQuery(queryText);
  };

  const handleVoiceSimulate = () => {
    if (isTyping) return;
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      processQuery("Show attendance below 75%");
    }, 2500);
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

          <AssistantHeader />

          {/* Core Popular Tasks Grid */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Standard Task Shortcuts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              
              <div 
                onClick={() => handleSuggestionClick("Find student Priya Patel")}
                className="p-5 rounded-2xl border border-white/5 bg-slate-900/20 hover:border-slate-800 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-36"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Find Student</p>
                  <p className="text-[10px] text-slate-500 mt-1">Locate profiles instantly</p>
                </div>
              </div>

              <div 
                onClick={() => handleSuggestionClick("Show attendance below 75%")}
                className="p-5 rounded-2xl border border-white/5 bg-slate-900/20 hover:border-slate-800 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-36"
              >
                <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Attendance Audit</p>
                  <p className="text-[10px] text-slate-500 mt-1">Flag shortage records</p>
                </div>
              </div>

              <div 
                onClick={() => handleSuggestionClick("Faculty workload balance")}
                className="p-5 rounded-2xl border border-white/5 bg-slate-900/20 hover:border-slate-800 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-36"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <BookOpen size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Faculty Workloads</p>
                  <p className="text-[10px] text-slate-500 mt-1">List teaching work allocation</p>
                </div>
              </div>

              <div 
                onClick={() => handleSuggestionClick("Predict grade distribution curves")}
                className="p-5 rounded-2xl border border-white/5 bg-slate-900/20 hover:border-slate-800 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-36"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                  <BarChart3 size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Grade Forecasts</p>
                  <p className="text-[10px] text-slate-500 mt-1">Project passing grades</p>
                </div>
              </div>

            </div>
          </div>

          {/* Chat Sandbox Console */}
          <div className="rounded-3xl border border-white/5 bg-slate-950/60 backdrop-blur-xl p-6 md:p-8 flex flex-col h-[520px] justify-between shadow-2xl overflow-hidden relative">
            
            {/* Ambient glows inside chat */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6">
              {messages.map((m, idx) => (
                <div key={idx} className="space-y-3">
                  <ChatBubble
                    sender={m.sender}
                    message={m.text}
                    icon={m.sender === "ai" ? <Sparkles size={16} /> : undefined}
                  />

                  {/* Render dynamic sub elements inside chat bubble if present */}
                  {m.elements && (
                    <div className="ml-14 max-w-xl pb-2">
                      {m.elements}
                    </div>
                  )}

                  {/* Render context actions sub buttons */}
                  {m.actions && m.actions.length > 0 && (
                    <div className="ml-14 flex flex-wrap gap-2.5 pb-2">
                      {m.actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={act.onClick}
                          className="px-3 py-1.5 rounded-xl border border-slate-900 bg-slate-950 text-[10px] font-bold text-slate-300 hover:text-white hover:border-slate-800 transition"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Section */}
            <div className="border-t border-slate-900 pt-6">
              <div className="flex items-center gap-3 p-2 bg-slate-900/60 border border-slate-900 rounded-2xl relative">
                
                {/* Voice command button */}
                <button
                  type="button"
                  onClick={handleVoiceSimulate}
                  className={`p-2 rounded-xl transition ${
                    isListening 
                      ? "bg-red-500/20 text-red-400 animate-pulse" 
                      : "bg-slate-950 border border-slate-900 text-slate-500 hover:text-slate-300"
                  }`}
                  title="Simulate Voice Command"
                >
                  <Mic size={16} />
                </button>

                {isListening ? (
                  <div className="flex-1 flex items-center justify-between px-3 h-10 select-none">
                    <span className="text-xs text-red-400 font-semibold animate-pulse">Capturing simulated voice command...</span>
                    
                    {/* Glowing audio wave frequency lines */}
                    <div className="flex items-center gap-1.5 h-6">
                      <div className="w-1 h-3 bg-red-400 rounded-full animate-wave-1" />
                      <div className="w-1 h-5 bg-red-400 rounded-full animate-wave-2" />
                      <div className="w-1 h-4 bg-red-400 rounded-full animate-wave-3" />
                      <div className="w-1 h-6 bg-red-400 rounded-full animate-wave-4" />
                      <div className="w-1 h-3 bg-red-400 rounded-full animate-wave-5" />
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
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center transition hover:scale-105 disabled:opacity-50 shrink-0"
                >
                  <SendHorizonal size={16} />
                </button>

              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default AIAssistant;
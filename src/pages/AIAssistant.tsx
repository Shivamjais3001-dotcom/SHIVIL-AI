import { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { aiCoreService } from "../services/aiCore";
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
  Volume2,
  Terminal,
  Search,
  CheckCircle,
  FolderDot,
  FileCode,
  Mail,
  Award,
  Zap,
  Activity,
  Edit3,
  X,
  Database
} from "lucide-react";
import type { Student } from "../types/student";
import type { Faculty } from "../types/faculty";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  codeBlock?: { lang: string; code: string };
  tableData?: Array<Record<string, string>>;
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
  const [searchConvQuery, setSearchConvQuery] = useState("");
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize mock conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      title: "Q3 Attendance Shortages",
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
          text: "Predictive Analytics show a 94.2% passing trajectory. Supplemental tutoring templates loaded."
        }
      ]
    }
  ]);
  
  const [activeConvId, setActiveConvId] = useState("conv-1");

  // Filter conversations by search query
  const filteredConversations = useMemo(() => {
    return conversations.filter(c => 
      c.title.toLowerCase().includes(searchConvQuery.toLowerCase())
    );
  }, [conversations, searchConvQuery]);

  // Get current active conversation
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConvId) || conversations[0];
  }, [conversations, activeConvId]);

  // AI Workspace files: Reports, notices, etc.
  const [workspaceFiles, setWorkspaceFiles] = useState([
    { name: "shortages_audit_Q3.xlsx", category: "Reports", size: "24 KB" },
    { name: "remedial_classes_schedule.pdf", category: "Documents", size: "128 KB" },
    { name: "bell_curve_midterm_distribution.svg", category: "Charts", size: "84 KB" },
    { name: "warning_notice_parents_neha.pdf", category: "Notices", size: "48 KB" },
    { name: "academic_excellence_priya.pdf", category: "Certificates", size: "110 KB" }
  ]);

  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<"Reports" | "Documents" | "Charts" | "Notices" | "Certificates">("Reports");

  const filteredWorkspaceFiles = useMemo(() => {
    return workspaceFiles.filter(file => file.category === activeWorkspaceTab);
  }, [workspaceFiles, activeWorkspaceTab]);

  // Memory Panel Mock context variables
  const selectedContext = {
    student: "Neha Reddy (CSE, Year 3)",
    course: "CS-302 Advanced Algorithms",
    faculty: "Dr. Sarah Jenkins",
    activeMemoryTokens: 1840,
    sessionMode: "Autonomous Admin Operator"
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation.messages, isTyping]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Processing input queries using active AI Service Layer
  const processQuery = async (text: string) => {
    if (!text.trim()) return;

    // User Message
    const updatedMessages = [...activeConversation.messages, { sender: "user", text } as ChatMessage];
    
    setConversations(prev => 
      prev.map(c => c.id === activeConvId ? { ...c, messages: updatedMessages } : c)
    );
    setInputText("");
    setIsTyping(true);

    try {
      const response = await aiCoreService.generateResponse(text, "Base", { provider: "gemini" });
      setConversations(prev => 
        prev.map(c => c.id === activeConvId ? {
          ...c,
          messages: [...updatedMessages, {
            sender: "ai",
            text: response.text,
            codeBlock: response.codeBlock,
            tableData: response.tableData
          }]
        } : c)
      );
    } catch (err) {
      setConversations(prev => 
        prev.map(c => c.id === activeConvId ? {
          ...c,
          messages: [...updatedMessages, {
            sender: "ai",
            text: "🚨 Generation failed. LLM provider offline or timed out."
          }]
        } : c)
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (queryText: string) => {
    processQuery(queryText);
  };

  const handleVoiceSimulate = () => {
    if (isTyping) return;
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      processQuery("Predict student dropout risk profiles");
    }, 2800);
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId("conv-blank");
    }
  };

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

  const startRenameConversation = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvId(id);
    setEditingTitleText(title);
  };

  const saveRenameConversation = (id: string) => {
    if (!editingTitleText.trim()) return;
    setConversations(prev => 
      prev.map(c => c.id === id ? { ...c, title: editingTitleText } : c)
    );
    setEditingConvId(null);
    triggerToast("Conversation log title updated.");
  };

  const togglePinConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => 
      prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c)
    );
    triggerToast("Conversation pin status updated.");
  };

  return (
    <div className="flex min-h-screen bg-[#030712] overflow-hidden text-slate-100 font-sans select-none">
      <Sidebar />

      {/* Main OS Console Screen */}
      <div className="flex-1 flex flex-col lg:flex-row h-screen min-w-0">
        
        {/* PANEL 1 (Left 3 cols): Session History & Context Panel */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-[#050814]/70 p-4 space-y-6 shrink-0 h-full overflow-y-auto">
          
          <button 
            onClick={createNewSession}
            className="w-full py-2.5 rounded-xl bg-slate-900 border border-white/5 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-850 cursor-pointer transition flex items-center justify-center gap-2 shadow"
          >
            <Sparkles size={14} className="text-blue-400" />
            <span>New Console Session</span>
          </button>

          {/* Search conversations */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition" size={13} />
            <input 
              value={searchConvQuery}
              onChange={(e) => setSearchConvQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-900 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-slate-800 transition"
            />
          </div>

          {/* Pinned Log lists */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5 px-2 select-none">
              <Pin size={10} className="text-purple-400" />
              <span>Pinned Sessions</span>
            </span>
            <div className="space-y-1">
              {filteredConversations.filter(c => c.isPinned).map(c => (
                <div 
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer group transition ${
                    activeConvId === c.id ? "bg-slate-900 text-white border border-white/5" : "text-slate-400 hover:bg-slate-950/50 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare size={13} className="text-slate-500 group-hover:text-slate-300" />
                    {editingConvId === c.id ? (
                      <input 
                        value={editingTitleText}
                        onChange={(e) => setEditingTitleText(e.target.value)}
                        onBlur={() => saveRenameConversation(c.id)}
                        onKeyDown={(e) => e.key === "Enter" && saveRenameConversation(c.id)}
                        className="bg-transparent text-xs text-white focus:outline-none w-full"
                        autoFocus
                      />
                    ) : (
                      <span className="truncate">{c.title}</span>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                    <button 
                      onClick={(e) => startRenameConversation(c.id, c.title, e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition cursor-pointer"
                    >
                      <Edit3 size={11} />
                    </button>
                    <button 
                      onClick={(e) => togglePinConversation(c.id, e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition cursor-pointer"
                    >
                      <Pin size={11} />
                    </button>
                    <button 
                      onClick={(e) => deleteConversation(c.id, e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recents list */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5 px-2 select-none">
              <History size={10} />
              <span>Recents</span>
            </span>
            <div className="space-y-1">
              {filteredConversations.filter(c => !c.isPinned).map(c => (
                <div 
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer group transition ${
                    activeConvId === c.id ? "bg-slate-900 text-white border border-white/5" : "text-slate-400 hover:bg-slate-950/50 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare size={13} className="text-slate-500 group-hover:text-slate-300" />
                    {editingConvId === c.id ? (
                      <input 
                        value={editingTitleText}
                        onChange={(e) => setEditingTitleText(e.target.value)}
                        onBlur={() => saveRenameConversation(c.id)}
                        onKeyDown={(e) => e.key === "Enter" && saveRenameConversation(c.id)}
                        className="bg-transparent text-xs text-white focus:outline-none w-full"
                        autoFocus
                      />
                    ) : (
                      <span className="truncate">{c.title}</span>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                    <button 
                      onClick={(e) => startRenameConversation(c.id, c.title, e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition cursor-pointer"
                    >
                      <Edit3 size={11} />
                    </button>
                    <button 
                      onClick={(e) => togglePinConversation(c.id, e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-white transition cursor-pointer"
                    >
                      <Pin size={11} />
                    </button>
                    <button 
                      onClick={(e) => deleteConversation(c.id, e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Context Memory Panel */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-4.5 pt-4">
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5 select-none leading-none">
              <Database size={10} className="text-blue-400 animate-pulse" />
              <span>AI System Context memory</span>
            </span>

            <div className="space-y-3.5 text-[10px] text-slate-400 font-sans">
              <div className="space-y-1">
                <span className="text-slate-500 block">Selected Student context:</span>
                <span className="font-semibold text-white">{selectedContext.student}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">Active curriculum:</span>
                <span className="font-semibold text-white">{selectedContext.course}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 block">Assigned Faculty:</span>
                <span className="font-semibold text-white">{selectedContext.faculty}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                <span className="text-[9px] text-slate-500 uppercase font-mono">Memory Tokens</span>
                <span className="font-mono text-blue-400 font-bold">{selectedContext.activeMemoryTokens}</span>
              </div>
            </div>
          </div>

        </aside>

        {/* PANEL 2: Active Sandbox Chat Console */}
        <section className="flex-1 flex flex-col justify-between h-full bg-slate-950/40 min-w-0 border-r border-white/5 relative">
          
          <div className="px-6 py-4 border-b border-white/5 bg-[#050814]/50 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 leading-none">
                <Terminal size={14} className="text-blue-400" />
                <span>{activeConversation.title}</span>
              </h2>
              <p className="text-[10px] text-slate-500 mt-1.5 font-semibold">Active SHIVIL AI Engine Console</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 font-mono">Autonomous Mode</span>
            </div>
          </div>

          {/* Toast */}
          {toastMessage && (
            <div className="absolute top-18 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-500/30 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Chat scroll box */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {activeConversation.messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-4 items-start max-w-2xl ${
                  m.sender === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                  m.sender === "ai" 
                    ? "bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-blue-500/20 text-blue-400" 
                    : "bg-slate-900 border-white/5 text-slate-300 font-bold text-xs font-mono"
                }`}>
                  {m.sender === "ai" ? <Sparkles size={16} /> : activeName.charAt(0)}
                </div>

                <div className="space-y-3.5 flex-1 min-w-0">
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                    m.sender === "user" 
                      ? "bg-slate-900 border-slate-800 text-slate-100" 
                      : "bg-slate-950/80 border-white/5 text-slate-300"
                  }`}>
                    {m.text}
                  </div>

                  {/* Render TableData */}
                  {m.tableData && (
                    <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-950 p-1">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-900/50 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                            {Object.keys(m.tableData[0]).map((key, i) => (
                              <th key={i} className="p-3">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900/50">
                          {m.tableData.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-900/40 transition">
                              {Object.values(row).map((val, k) => (
                                <td key={k} className="p-3 text-white font-semibold">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Render CodeBlock */}
                  {m.codeBlock && (
                    <div className="rounded-xl border border-slate-900 overflow-hidden text-left bg-slate-950 p-4 font-mono text-[10px] text-blue-400 select-text overflow-x-auto leading-normal">
                      <pre><code>{m.codeBlock.code}</code></pre>
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

          {/* Chat input box */}
          <div className="p-5 border-t border-white/5 bg-[#050814]/30 shrink-0">
            <div className="flex items-center gap-3.5 p-2 bg-slate-950/60 border border-white/5 rounded-2xl relative">
              <button
                type="button"
                onClick={handleVoiceSimulate}
                className={`p-2.5 rounded-xl transition cursor-pointer ${
                  isListening 
                    ? "bg-red-500/20 text-red-400 animate-pulse" 
                    : "bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300"
                }`}
                title="Trigger simulated voice input"
              >
                <Mic size={15} />
              </button>

              {isListening ? (
                <div className="flex-1 flex items-center justify-between px-3 h-10 select-none">
                  <span className="text-xs text-red-400 font-semibold animate-pulse">Capturing voice logs...</span>
                  <div className="flex items-center gap-1 h-5">
                    <div className="w-0.5 h-2.5 bg-red-400 rounded-full animate-wave-1" />
                    <div className="w-0.5 h-4 bg-red-400 rounded-full animate-wave-2" />
                    <div className="w-0.5 h-3 bg-red-400 rounded-full animate-wave-3" />
                    <div className="w-0.5 h-5 bg-red-400 rounded-full animate-wave-4" />
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

        {/* PANEL 3: Command Center & AI Workspace files */}
        <aside className="hidden xl:flex flex-col w-96 border-l border-white/5 bg-[#050814]/70 p-5 space-y-6 shrink-0 h-full overflow-y-auto">
          
          {/* Voice AI Wave Widget */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Volume2 size={14} className="text-purple-400" />
              <span>Voice AI Assistant</span>
            </h3>
            
            <div className="mt-4 flex flex-col items-center py-4 bg-slate-900/30 rounded-xl border border-slate-900">
              <div 
                onClick={handleVoiceSimulate}
                className={`w-12 h-12 rounded-full flex items-center justify-center border cursor-pointer transition duration-200 ${
                  isListening 
                    ? "bg-red-500/10 border-red-500/30 text-red-400" 
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-purple-500/30 hover:text-purple-400"
                }`}
              >
                <Mic size={18} />
              </div>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase mt-3">
                {isListening ? "Listening..." : "Speak to Command Center"}
              </span>
            </div>
          </div>

          {/* AI Quick Commands Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 px-1">
              <Zap size={13} className="text-blue-400 animate-pulse" />
              <span>AI Quick Commands</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleSuggestionClick("Find student Priya Patel")}
                className="py-2 px-3 text-left rounded-xl bg-slate-950 border border-slate-900 text-[10px] text-slate-400 hover:text-white hover:border-slate-800 transition cursor-pointer"
              >
                Find Student
              </button>
              <button 
                onClick={() => handleSuggestionClick("Generate attendance shortage report")}
                className="py-2 px-3 text-left rounded-xl bg-slate-950 border border-slate-900 text-[10px] text-slate-400 hover:text-white hover:border-slate-800 transition cursor-pointer"
              >
                Attendance Report
              </button>
              <button 
                onClick={() => handleSuggestionClick("Predict dropout risk CSE")}
                className="py-2 px-3 text-left rounded-xl bg-slate-950 border border-slate-900 text-[10px] text-slate-400 hover:text-white hover:border-slate-800 transition cursor-pointer"
              >
                Predict Dropout Risk
              </button>
              <button 
                onClick={() => handleSuggestionClick("Generate faculty workload report")}
                className="py-2 px-3 text-left rounded-xl bg-slate-950 border border-slate-900 text-[10px] text-slate-400 hover:text-white hover:border-slate-800 transition cursor-pointer"
              >
                Faculty Report
              </button>
            </div>
          </div>

          {/* AI Workspace: Categorised files lists */}
          <div className="space-y-3.5 flex-1 flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-white flex items-center gap-2 px-1 shrink-0">
              <FolderDot size={13} className="text-purple-400" />
              <span>AI OS Workspace</span>
            </h3>

            {/* Sub-tab selection */}
            <div className="flex flex-wrap gap-1 bg-slate-950 border border-white/5 p-1 rounded-xl shrink-0">
              {(["Reports", "Documents", "Charts", "Notices", "Certificates"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveWorkspaceTab(tab)}
                  className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase transition cursor-pointer ${
                    activeWorkspaceTab === tab ? "bg-slate-900 text-blue-400" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* List category items */}
            <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
              {filteredWorkspaceFiles.map((file, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-between hover:border-slate-850 transition group/item">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={14} className="text-slate-500 group-hover/item:text-blue-400 transition shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white truncate leading-none">{file.name}</p>
                      <p className="text-[8px] text-slate-500 mt-1.5 leading-none">{file.size} • Workspace</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => triggerToast(`Downloaded ${file.name}`)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-white transition shrink-0 cursor-pointer"
                  >
                    <ChevronRight size={11} />
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
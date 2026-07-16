import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { 
  Sparkles, 
  Play, 
  Trash2, 
  Settings as SettingsIcon, 
  Plus, 
  Mail, 
  Calendar, 
  AlertTriangle, 
  GitFork, 
  CheckCircle2, 
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
  Database,
  Workflow,
  Sliders,
  Bell
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action";
  label: string;
  desc: string;
  status?: string;
}

interface WorkflowTemplate {
  name: string;
  desc: string;
  nodes: WorkflowNode[];
}

function Workflows() {
  const [toastMessage, setToastMessage] = useState("");
  const [aiPromptInput, setAiPromptInput] = useState("");
  
  // Active workflow nodes list
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: "node-1", type: "trigger", label: "Attendance drops below 75%", desc: "Triggers on weekly compliance register analysis" },
    { id: "node-2", type: "condition", label: "Is Student Course == Algorithms?", desc: "Checks course assignment parameters" },
    { id: "node-3", type: "action", label: "Notify Student (Email/SMS)", desc: "Dispatches warning email draft" },
    { id: "node-4", type: "action", label: "Notify parent via SMS notice", desc: "Trigger parent alert notification preview template" },
    { id: "node-5", type: "action", label: "Generate Warning Notice Dossier", desc: "Auto-adds warning PDF ledger to reports catalog" },
    { id: "node-6", type: "action", label: "Schedule Tutor Counseling", desc: "Books calendar office hours cabin slots" }
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node-1");

  const templates: WorkflowTemplate[] = [
    {
      name: "Shortage Warning Sequence",
      desc: "Warns parents and schedules counselor when attendance drops below 75%",
      nodes: [
        { id: "t1-1", type: "trigger", label: "Attendance drops below 75%", desc: "Triggers on weekly compliance registers" },
        { id: "t1-2", type: "action", label: "Notify Student (Email/SMS)", desc: "Dispatches alert" },
        { id: "t1-3", type: "action", label: "Notify Parent", desc: "SMS Notice" }
      ]
    },
    {
      name: "Placement shortlisting alerts",
      desc: "Alerts students matching corporate CGPA eligibility limits",
      nodes: [
        { id: "t2-1", type: "trigger", label: "New Placement offer logged", desc: "Triggers on placement posting" },
        { id: "t2-2", type: "condition", label: "Student CGPA >= 8.5?", desc: "Verifies threshold compliance" },
        { id: "t2-3", type: "action", label: "Email invitation dossier", desc: "Invites candidate to apply" }
      ]
    }
  ];

  const executionHistory = [
    { student: "Neha Reddy", action: "Parent warn SMS dispatched", status: "Success", time: "12 mins ago" },
    { student: "Anya Sen", action: "Tutor counseling booked", status: "Success", time: "1 hour ago" },
    { student: "Rohan Gupta", action: "Warning PDF compiled", status: "Success", time: "3 hours ago" }
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleAddNode = (type: "trigger" | "condition" | "action") => {
    let label = "New Action Node";
    let desc = "Action details configuration";
    if (type === "trigger") {
      label = "Custom Trigger condition";
      desc = "Trigger parameter values";
    } else if (type === "condition") {
      label = "Conditional Check parameter";
      desc = "True/False logic validation rules";
    }
    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      type,
      label,
      desc
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    triggerToast(`Added new ${type} node to canvas.`);
  };

  const handleDeleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
    triggerToast("Node deleted from visual canvas.");
  };

  const handleLoadTemplate = (tpl: WorkflowTemplate) => {
    setNodes(tpl.nodes);
    setSelectedNodeId(tpl.nodes[0]?.id || null);
    triggerToast(`Loaded '${tpl.name}' template.`);
  };

  // AI Workflow Generator logic
  const handleGenerateAiWorkflow = () => {
    if (!aiPromptInput.trim()) return;
    const generatedNodes: WorkflowNode[] = [
      { id: "ai-1", type: "trigger", label: "CGPA falls below 6.0", desc: "Trigger on term marks locking" },
      { id: "ai-2", type: "condition", label: "Active backlog count > 2?", desc: "Checks backlog ledgers" },
      { id: "ai-3", type: "action", label: "Email academic advisor", desc: "Flag profiles for review" },
      { id: "ai-4", type: "action", label: "Restrict hostel checkout options", desc: "Placeholder policy check" }
    ];
    setNodes(generatedNodes);
    setSelectedNodeId("ai-1");
    setAiPromptInput("");
    triggerToast("Workflow generated by SHIVIL AI.");
  };

  const handleExecuteWorkflow = () => {
    triggerToast("⚡ Workflow execution test pipeline launched. 6 nodes compiled successfully.");
  };

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId);
  }, [nodes, selectedNodeId]);

  return (
    <div className="flex min-h-screen bg-[#030712] font-sans overflow-x-hidden selection:bg-blue-500/20 text-slate-100 h-screen overflow-hidden">
      <Sidebar />

      {/* Main Studio Console Split Pane */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        
        {/* Header toolbar */}
        <div className="px-6 py-4.5 border-b border-white/5 bg-[#050814]/50 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2 leading-none">
              <Workflow size={15} className="text-blue-500" />
              <span>Workflow Automation Studio</span>
            </h1>
            <p className="text-[10px] text-slate-500 mt-1.5 font-semibold">Visual Drag-and-Drop Node Logic Compiler</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExecuteWorkflow}
              disabled={nodes.length === 0}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-xs font-bold text-white flex items-center gap-1.5 shadow transition disabled:opacity-50 cursor-pointer"
            >
              <Play size={12} fill="white" />
              <span>Run Execution Test</span>
            </button>
          </div>
        </div>

        {/* Studio Content panels */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          
          {/* LEFT COLUMN: Library, AI Prompt Generator & Templates (w-80) */}
          <aside className="w-80 border-r border-white/5 bg-[#050814]/70 p-4 space-y-6 overflow-y-auto shrink-0 h-full">
            
            {/* AI Workflow Generator */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-4">
              <span className="text-[9px] uppercase tracking-wider font-bold text-purple-400 flex items-center gap-1.5 select-none leading-none">
                <Sparkles size={11} className="animate-pulse" />
                <span>AI Workflow Builder</span>
              </span>

              <div className="space-y-3">
                <textarea 
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  placeholder="Describe your target sequence (e.g. 'If student fails Algorithms, email advisor...')"
                  className="w-full h-20 p-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-slate-800 transition resize-none placeholder-slate-700"
                />
                <button 
                  onClick={handleGenerateAiWorkflow}
                  disabled={!aiPromptInput.trim()}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/5 text-[10px] font-bold text-purple-400 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles size={11} />
                  <span>Generate Nodes Grid</span>
                </button>
              </div>
            </div>

            {/* Template Library */}
            <div className="space-y-3.5">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 px-1 select-none">
                Workflow Templates
              </span>

              <div className="space-y-2">
                {templates.map((tpl, i) => (
                  <div 
                    key={i}
                    onClick={() => handleLoadTemplate(tpl)}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 hover:border-slate-800 cursor-pointer transition space-y-1.5"
                  >
                    <p className="text-xs font-bold text-white leading-none">{tpl.name}</p>
                    <p className="text-[9px] text-slate-500 leading-normal">{tpl.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution logs */}
            <div className="space-y-3.5">
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 px-1 select-none">
                Execution History log
              </span>

              <div className="space-y-2.5 pl-1.5">
                {executionHistory.map((item, i) => (
                  <div key={i} className="flex gap-2.5 items-start text-xs leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-white leading-none">{item.action}</p>
                      <p className="text-[9px] text-slate-500 mt-1.5 leading-none">{item.student} • {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

          {/* CENTER PANEL: Dot Grid Canvas Node Editor */}
          <section className="flex-1 bg-slate-950/20 relative overflow-hidden flex flex-col justify-between select-none h-full min-w-0">
            
            {/* Dots background overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage: "radial-gradient(#ffffff0a 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}
            />

            {/* Visual Canvas Node Flow */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 flex flex-col items-center">
              {nodes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 max-w-sm">
                  <Workflow size={28} className="text-slate-700 animate-pulse" />
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Visual nodes canvas is clean. Tap sidebar template configurations or custom buttons to add parameters.
                  </p>
                </div>
              ) : (
                nodes.map((node, index) => (
                  <div key={node.id} className="flex flex-col items-center">
                    
                    {/* Visual Connection Arrow Line */}
                    {index > 0 && (
                      <div className="h-8 w-0.5 bg-gradient-to-b from-blue-500/50 to-purple-500/50 relative">
                        <div className="absolute -bottom-1 -left-[3.5px] border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-500" />
                      </div>
                    )}

                    {/* Node block */}
                    <div 
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-72 p-4.5 rounded-2xl border backdrop-blur-xl relative transition duration-200 cursor-pointer shadow-lg group ${
                        selectedNodeId === node.id 
                          ? "bg-slate-950 border-blue-500/35" 
                          : "bg-slate-950/70 border-white/5 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <span className={`text-[8px] font-bold uppercase tracking-wider font-mono px-1.5 py-0.5 rounded border leading-none ${
                            node.type === "trigger" 
                              ? "bg-red-500/10 border-red-500/20 text-red-400" 
                              : node.type === "condition"
                              ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                          }`}>
                            {node.type}
                          </span>
                          <p className="text-xs font-bold text-white pt-1">{node.label}</p>
                          <p className="text-[9px] text-slate-500 font-medium leading-normal pt-0.5">{node.desc}</p>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNode(node.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-900 border border-slate-850 text-slate-500 hover:text-red-400 transition shrink-0 cursor-pointer"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Quick Nodes adder toolbar */}
            <div className="p-4 border-t border-white/5 bg-[#050814]/30 shrink-0 relative z-20 flex justify-center gap-3">
              <button 
                onClick={() => handleAddNode("trigger")}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-red-400 hover:text-white cursor-pointer transition flex items-center gap-1.5"
              >
                <Plus size={11} />
                <span>Add Trigger</span>
              </button>
              <button 
                onClick={() => handleAddNode("condition")}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-yellow-400 hover:text-white cursor-pointer transition flex items-center gap-1.5"
              >
                <Plus size={11} />
                <span>Add Condition</span>
              </button>
              <button 
                onClick={() => handleAddNode("action")}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-blue-400 hover:text-white cursor-pointer transition flex items-center gap-1.5"
              >
                <Plus size={11} />
                <span>Add Action</span>
              </button>
            </div>

          </section>

          {/* RIGHT COLUMN: Node Parameter Configuration panel (w-80) */}
          <aside className="w-80 border-l border-white/5 bg-[#050814]/70 p-4 space-y-6 overflow-y-auto shrink-0 h-full">
            
            <div className="flex items-center gap-2 pb-3 border-b border-slate-900 select-none">
              <Sliders size={13} className="text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Node Parameter Config</h3>
            </div>

            {selectedNode ? (
              <div className="space-y-5 text-xs">
                
                {/* Node parameters */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block select-none">Node ID Label</span>
                  <input 
                    value={selectedNode.label}
                    onChange={(e) => {
                      const text = e.target.value;
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, label: text } : n));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-900 text-xs text-white focus:outline-none focus:border-slate-800 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block select-none">Description Logs</span>
                  <textarea 
                    value={selectedNode.desc}
                    onChange={(e) => {
                      const text = e.target.value;
                      setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, desc: text } : n));
                    }}
                    className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-900 text-xs text-white focus:outline-none focus:border-slate-800 transition resize-none"
                  />
                </div>

                {selectedNode.type === "trigger" && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 space-y-2 select-none">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Trigger Frequency Mode</p>
                    <select className="w-full bg-slate-900 border border-slate-850 p-1.5 rounded-lg text-[10px] text-white focus:outline-none">
                      <option>Real-time (Every check-in)</option>
                      <option>Weekly cron audit</option>
                      <option>Manual execute authorization</option>
                    </select>
                  </div>
                )}

                {selectedNode.type === "action" && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 space-y-2 select-none">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Dispatch Target</p>
                    <select className="w-full bg-slate-900 border border-slate-850 p-1.5 rounded-lg text-[10px] text-white focus:outline-none">
                      <option>Student Warning Queue</option>
                      <option>Parent Email SMTP</option>
                      <option>Faculty Senate dossier</option>
                    </select>
                  </div>
                )}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 space-y-2 text-slate-500 select-none">
                <HelpCircle size={20} className="text-slate-700 animate-pulse" />
                <p className="text-[10px] font-semibold leading-normal">
                  Select a workflow node from the canvas to adjust parameter indices.
                </p>
              </div>
            )}

          </aside>

        </div>

      </div>

      {/* Toast Notification */}
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

export default Workflows;

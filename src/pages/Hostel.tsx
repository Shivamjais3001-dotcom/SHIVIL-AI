import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { 
  Home, 
  Sparkles, 
  CheckCircle2,
  Building,
  Sliders,
  AlertTriangle,
  Mail,
  User,
  Coffee
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Hostel() {
  const [toastMessage, setToastMessage] = useState("");

  const metrics = {
    occupants: 420,
    occupancyRate: "94.2%",
    repairs: 4,
    messRating: "4.4/5.0"
  };

  const blocks = [
    { name: "Block A (Boys)", capacity: "200 seats", occupancy: "96%", status: "Filled" },
    { name: "Block B (Girls)", capacity: "200 seats", occupancy: "92%", status: "Available" },
    { name: "Block C (Faculty)", capacity: "50 seats", occupancy: "88%", status: "Available" }
  ];

  const repairTickets = [
    { id: "TK-402", room: "A-204", category: "Electrical repair", date: "Today", status: "Assigned" },
    { id: "TK-399", room: "B-108", category: "Water leakage", date: "Yesterday", status: "Completed" }
  ];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  return (
    <div className="flex min-h-screen bg-[#030712] font-sans text-slate-100 selection:bg-blue-500/20 overflow-hidden h-screen select-none">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-full min-w-0">
        <div className="max-w-7xl mx-auto space-y-8 relative">
          
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

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <Home className="text-blue-500" size={26} />
                <span>Hostel Operations Workspace</span>
              </h1>
              <p className="text-slate-500 text-xs mt-1">
                Monitor room allocations, maintenance work orders, and dining mess feedbacks.
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-[10px] text-blue-400 font-bold uppercase tracking-wider shrink-0 self-start md:self-auto">
              <Sparkles size={12} className="animate-pulse" />
              <span>AI Facilities Allocator</span>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Occupants</p>
              <h3 className="text-2xl font-extrabold text-white mt-2 font-mono">{metrics.occupants} Students</h3>
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-2.5">
                <span>99.8% check-in log uptime</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Occupancy Rate</p>
              <h3 className="text-2xl font-extrabold text-blue-400 mt-2 font-mono">{metrics.occupancyRate}</h3>
              <div className="flex items-center gap-1 text-[9px] text-slate-500 font-semibold mt-2.5">
                <span>Stable room allocations</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Open Repair Tasks</p>
              <h3 className="text-2xl font-extrabold text-red-400 mt-2 font-mono">{metrics.repairs} Tickets</h3>
              <div className="flex items-center gap-1 text-[9px] text-red-400/80 font-semibold mt-2.5">
                <AlertTriangle size={11} />
                <span>Requires technician dispatch</span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/5 bg-slate-950/40 p-5 backdrop-blur-xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mess Rating</p>
              <h3 className="text-2xl font-extrabold text-emerald-400 mt-2 font-mono">{metrics.messRating}</h3>
              <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold mt-2.5">
                <Coffee size={11} />
                <span>Good dining kitchen feedback</span>
              </div>
            </div>
          </div>

          {/* Split Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Blocks listing */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Blocks grid card */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Building size={14} className="text-blue-500" />
                  <span>Hostel block capacity status</span>
                </h3>

                <div className="space-y-3">
                  {blocks.map((b, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-900/60 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white leading-none">{b.name}</p>
                        <p className="text-[9px] text-slate-500 mt-1.5 leading-none">Capacity: {b.capacity}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-white font-mono">{b.occupancy} loaded</span>
                        <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border ${
                          b.status === "Filled" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance tickets */}
              <div className="p-6 rounded-3xl border border-white/5 bg-slate-950/40 backdrop-blur-xl space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Sliders size={14} className="text-purple-400" />
                  <span>Active maintenance work orders</span>
                </h3>

                <div className="space-y-2.5">
                  {repairTickets.map(ticket => (
                    <div key={ticket.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900/60 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-blue-400 font-mono bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                            {ticket.id}
                          </span>
                          <span className="text-xs font-bold text-white">{ticket.category}</span>
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1.5 leading-none">Room: {ticket.room} • logged {ticket.date}</p>
                      </div>
                      <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border ${
                        ticket.status === "Completed" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-5 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-xl space-y-4 shadow-lg">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider pb-3 border-b border-slate-900">
                  <Sliders size={14} className="text-blue-400" />
                  <span>Warden dispatch logs</span>
                </h3>

                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-2xl space-y-3">
                  <p className="text-[11px] font-bold text-white leading-none">Dispatch maintenance SMS</p>
                  <p className="text-[9px] text-slate-500 leading-normal">
                    Alert the assigned plumbing and electrician contractors to resolve open tickets.
                  </p>
                  <button 
                    onClick={() => triggerToast("Contractors dispatched to Block A & B.")}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[9px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    Dispatch Contractors
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Hostel;

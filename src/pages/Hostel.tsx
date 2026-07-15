import Sidebar from "../components/Sidebar";
import { Home, Sparkles, UserCheck } from "lucide-react";

function Hostel() {
  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />
      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <Home className="text-pink-500" size={28} />
                <span>Hostel Operations</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Room allocations, mess calendars, and warden notifications.
              </p>
            </div>
          </div>
          
          <div className="rounded-3xl border border-white/5 bg-slate-900/10 p-8 text-center max-w-xl mx-auto mt-20 space-y-4">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto text-pink-400">
              <UserCheck size={24} />
            </div>
            <h2 className="text-lg font-bold text-white">No Mess Alerts</h2>
            <p className="text-slate-400 text-xs">
              Room allocation schedules and mess menu changes will appear here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Hostel;

import Sidebar from "../components/Sidebar";
import { CreditCard, DollarSign, Sparkles } from "lucide-react";

function Fees() {
  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />
      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <CreditCard className="text-emerald-500" size={28} />
                <span>Financial Ledger</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Manage invoices, collection logs, fee waivers, and outstanding dues.
              </p>
            </div>
          </div>
          
          <div className="rounded-3xl border border-white/5 bg-slate-900/10 p-8 text-center max-w-xl mx-auto mt-20 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-400">
              <DollarSign size={24} />
            </div>
            <h2 className="text-lg font-bold text-white">No Ledger Entries</h2>
            <p className="text-slate-400 text-xs">
              Fee invoices and online payment transactions will populate here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Fees;

import { Search, Plus, Sparkles } from "lucide-react";

interface Props {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  total: number;
  onAdd: () => void;
}

function FacultyHeader({
  search,
  setSearch,
  total,
  onAdd,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-900 pb-6">
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Sparkles size={24} className="text-purple-400" />
          <span>Faculty Directory</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor teaching workload metrics, department heads, and academic publications.
        </p>
      </div>

      <div className="flex items-center gap-4">
        
        {/* Search Input */}
        <div className="relative group min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search departments, names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950/50 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
          />
        </div>

        {/* Add Faculty Button */}
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-xs font-semibold text-white px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus size={16} />
          <span>Add Faculty</span>
        </button>

      </div>

    </div>
  );
}

export default FacultyHeader;
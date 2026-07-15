import { Search, Plus, Sparkles, Filter } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  filterDept: string;
  setFilterDept: (value: string) => void;
  onAdd: () => void;
  total: number;
}

function CourseHeader({ 
  search, 
  setSearch, 
  filterDept, 
  setFilterDept, 
  onAdd, 
  total 
}: Props) {
  const departments = [
    "All Departments",
    "Computer Science",
    "Electrical Eng",
    "Mechanical Eng",
    "Physics & EE",
    "Mathematics"
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-900 pb-6">
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Sparkles size={24} className="text-emerald-400" />
          <span>Curriculum Catalog</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review academic syllabus, credits allocations, semesters, and departments.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        
        {/* Search */}
        <div className="relative group min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code, name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950/50 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-200"
          />
        </div>

        {/* Department Filter Select */}
        <div className="flex items-center gap-2 bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-1">
          <Filter size={12} className="text-slate-500" />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-transparent border-none text-[11px] text-slate-300 focus:outline-none py-1.5 font-semibold cursor-pointer"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept === "All Departments" ? "All" : dept} className="bg-slate-950 text-white">
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Add Course CTA */}
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-semibold text-white px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus size={16} />
          <span>New Course</span>
        </button>

      </div>

    </div>
  );
}

export default CourseHeader;

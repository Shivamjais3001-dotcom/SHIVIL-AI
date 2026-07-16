import type { Faculty } from "../../types/faculty";
import { Edit2, Trash2, Sparkles } from "lucide-react";

interface Props {
  faculty: Faculty[];
  search: string;
  onEdit: (faculty: Faculty) => void;
  onDelete: (id: number) => void;
  onViewWorkspace: (faculty: Faculty) => void;
}

function FacultyTable({
  faculty,
  search,
  onEdit,
  onDelete,
  onViewWorkspace
}: Props) {
  const filteredFaculty = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-3xl border border-white/5 bg-slate-950/40 overflow-hidden shadow-2xl overflow-x-auto">
      <table className="w-full text-left border-collapse">
        
        <thead>
          <tr className="border-b border-slate-900 bg-slate-900/10">
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Faculty Member</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Assigned Department</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Communication Channel</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-900/60">
          {filteredFaculty.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-xs text-slate-500 font-medium">
                No active faculty members matched current queries.
              </td>
            </tr>
          ) : (
            filteredFaculty.map((f) => (
              <tr 
                key={f.id} 
                className="hover:bg-slate-900/20 transition-colors duration-150"
              >
                {/* Faculty details */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 flex items-center justify-center font-bold text-white text-xs font-mono">
                      {f.name.replace("Dr. ", "").replace("Prof. ", "").charAt(0)}
                    </div>
                    <span 
                      onClick={() => onViewWorkspace(f)}
                      className="text-xs font-semibold text-white hover:text-blue-400 transition cursor-pointer"
                    >
                      {f.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-xs text-slate-300">
                  {f.department}
                </td>

                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                  {f.email}
                </td>

                {/* Edit & Delete CTA options */}
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => onViewWorkspace(f)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 hover:text-white hover:border-purple-600/35 transition cursor-pointer"
                      title="View Faculty Intelligence Workspace"
                    >
                      <Sparkles size={12} className="animate-pulse" />
                    </button>
                    <button
                      onClick={() => onEdit(f)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
                      title="Edit details"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => onDelete(f.id)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}

export default FacultyTable;
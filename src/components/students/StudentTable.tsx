import type { Student } from "../../types/student";
import { Edit2, Trash2, ShieldAlert, Sparkles } from "lucide-react";

interface Props {
  students: Student[];
  search: string;
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
  onViewWorkspace: (student: Student) => void;
}

function StudentTable({ students, search, onEdit, onDelete, onViewWorkspace }: Props) {
  return (
    <div className="rounded-3xl border border-white/5 bg-slate-950/40 overflow-hidden shadow-2xl overflow-x-auto">
      <table className="w-full text-left border-collapse">
        
        <thead>
          <tr className="border-b border-slate-900 bg-slate-900/10">
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Student Profile</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">University Roll</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Department Branch</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Academic Year</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Ledger Status</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-900/60">
          {students.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500 font-medium">
                No active student records matched current filter queries.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr 
                key={student.id} 
                className="hover:bg-slate-900/20 transition-colors duration-150"
              >
                {/* Student Avatar + Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-white text-xs font-mono">
                      {student.name.charAt(0)}
                    </div>
                    <span 
                      onClick={() => onViewWorkspace(student)}
                      className="text-xs font-semibold text-white hover:text-blue-400 transition cursor-pointer"
                    >
                      {student.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 font-mono text-xs text-slate-400">
                  {student.roll}
                </td>

                <td className="px-6 py-4 text-xs text-slate-300">
                  {student.branch}
                </td>

                <td className="px-6 py-4 text-xs text-slate-400">
                  {student.year}
                </td>

                {/* Status Badges */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      student.status === "Active"
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}
                  >
                    {student.status === "Shortage" && <ShieldAlert size={10} />}
                    {student.status}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => onViewWorkspace(student)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 hover:text-white hover:border-purple-600/35 transition cursor-pointer"
                      title="View Student Intelligence Workspace"
                    >
                      <Sparkles size={12} className="animate-pulse" />
                    </button>
                    <button
                      onClick={() => onEdit(student)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
                      title="Edit student"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => onDelete(student.id!)}
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

export default StudentTable;
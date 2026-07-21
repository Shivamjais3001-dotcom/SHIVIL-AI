import { Pencil, Trash2, Sparkles } from "lucide-react";
import type { CourseType } from "../../types/course";

interface CourseTableProps {
  courses: CourseType[];
  onEdit: (course: CourseType) => void;
  onDelete: (id: number) => void;
  onViewWorkspace: (course: CourseType) => void;
}

function CourseTable({
  courses,
  onEdit,
  onDelete,
  onViewWorkspace
}: CourseTableProps) {
  return (
    <div className="rounded-3xl border border-white/5 bg-slate-950/40 overflow-hidden shadow-2xl overflow-x-auto">
      <table className="w-full text-left border-collapse">
        
        <thead>
          <tr className="border-b border-slate-900 bg-slate-900/10">
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Course Identity</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Title Syllabus</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Department Branch</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4">Credits Weight</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4 font-mono">Academic Semester</th>
            <th className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-900/60">
          {courses.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-xs text-slate-500 font-medium">
                No active courses logged in the curriculum catalog.
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr 
                key={course.id} 
                className="hover:bg-slate-900/20 transition-colors duration-150"
              >
                {/* Course Code with Badge styling */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 text-xs font-mono">
                      {(course.courseCode || (course as any).code || "CS").substring(0, 2)}
                    </div>
                    <span 
                      onClick={() => onViewWorkspace(course)}
                      className="text-xs font-bold text-white font-mono hover:text-blue-400 transition cursor-pointer"
                    >
                      {course.courseCode || (course as any).code || "N/A"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-xs font-semibold text-slate-200">
                  <span 
                    onClick={() => onViewWorkspace(course)}
                    className="hover:text-blue-400 transition cursor-pointer"
                  >
                    {course.courseName || (course as any).name || "Untitled Course"}
                  </span>
                </td>

                <td className="px-6 py-4 text-xs text-slate-400">
                  {course.department}
                </td>

                {/* Credits Indicator Badge */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${
                    Number(course.credits) === 4 
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-400" 
                      : Number(course.credits) === 3 
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-400" 
                      : "bg-slate-900 border-slate-800 text-slate-400"
                  }`}>
                    {course.credits} Credits
                  </span>
                </td>

                <td className="px-6 py-4 text-xs text-slate-300 font-mono">
                  {course.semester}
                </td>

                {/* Actions pencil/trash buttons */}
                <td className="px-6 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => onViewWorkspace(course)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 hover:text-white hover:border-purple-600/35 transition cursor-pointer"
                      title="View Course Intelligence Workspace"
                    >
                      <Sparkles size={12} className="animate-pulse" />
                    </button>
                    <button
                      onClick={() => onEdit(course)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
                      title="Edit syllabus"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => onDelete(course.id)}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition cursor-pointer"
                      title="Delete course"
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

export default CourseTable;
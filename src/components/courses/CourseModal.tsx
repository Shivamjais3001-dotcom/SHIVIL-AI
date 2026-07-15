import { useState, useEffect } from "react";
import type { CourseType } from "../../types/course";
import { X, Sparkles, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: CourseType) => void;
  editingCourse: CourseType | null;
}

function CourseModal({
  isOpen,
  onClose,
  onSave,
  editingCourse,
}: Props) {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [credits, setCredits] = useState("4");
  const [semester, setSemester] = useState("Semester I");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingCourse) {
      setCourseCode(editingCourse.courseCode);
      setCourseName(editingCourse.courseName);
      setDepartment(editingCourse.department);
      setCredits(editingCourse.credits.toString());
      setSemester(editingCourse.semester.toString());
      setError("");
    } else {
      setCourseCode("");
      setCourseName("");
      setDepartment("Computer Science");
      setCredits("4");
      setSemester("Semester I");
      setError("");
    }
  }, [editingCourse, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim() || !department.trim() || !credits.trim() || !semester.trim()) {
      setError("Please input all course specification details.");
      return;
    }

    const newCourse: CourseType = {
      id: editingCourse ? editingCourse.id : Date.now(),
      courseCode: courseCode.trim().toUpperCase(),
      courseName: courseName.trim(),
      department,
      credits: Number(credits) || 4,
      semester,
    };

    onSave(newCourse);
    onClose();
  };

  const departments = [
    "Computer Science",
    "Electrical Eng",
    "Mechanical Eng",
    "Physics & EE",
    "Mathematics"
  ];

  const semesters = [
    "Semester I",
    "Semester II",
    "Semester III",
    "Semester IV",
    "Semester V",
    "Semester VI",
    "Semester VII",
    "Semester VIII"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/5 bg-slate-950 p-6 md:p-8 shadow-2xl overflow-hidden">
        
        {/* Glow indicator line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Sparkles size={16} />
            </div>
            <h2 className="text-lg font-bold text-white">
              {editingCourse ? "Modify Course Node" : "Publish Course Syllabus"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {/* Course Code */}
            <div className="col-span-1 space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Code</label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-emerald-500/50 transition-colors uppercase font-mono"
                placeholder="e.g. CS-302"
                value={courseCode}
                onChange={(e) => {
                  setCourseCode(e.target.value);
                  setError("");
                }}
              />
            </div>

            {/* Course Name */}
            <div className="col-span-2 space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Course Title</label>
              <input
                className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                placeholder="e.g. Advanced Algorithms"
                value={courseName}
                onChange={(e) => {
                  setCourseName(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>

          {/* Department selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Department</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d} value={d} className="bg-slate-950 text-white">{d}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Semester select */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Academic Semester</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                {semesters.map((s) => (
                  <option key={s} value={s} className="bg-slate-950 text-white">{s}</option>
                ))}
              </select>
            </div>

            {/* Credits */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Credits</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors font-mono"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
              >
                <option value="2" className="bg-slate-950 text-white">2 Credits (Elective)</option>
                <option value="3" className="bg-slate-950 text-white">3 Credits (Core)</option>
                <option value="4" className="bg-slate-950 text-white">4 Credits (Core Lab)</option>
              </select>
            </div>
          </div>

          {/* Buttons footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-900/60 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-semibold text-white rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.01]"
            >
              {editingCourse ? "Update Course" : "Publish Course"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default CourseModal;

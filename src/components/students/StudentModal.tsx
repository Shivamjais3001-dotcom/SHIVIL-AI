import type { Student } from "../../types/student";
import { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  editingStudent: Student | null;
}

function StudentModal({
  isOpen,
  onClose,
  onSave,
  editingStudent,
}: Props) {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name);
      setRoll(editingStudent.roll);
      setBranch(editingStudent.branch);
      setYear(editingStudent.year);
      setStatus(editingStudent.status || "Active");
      setError("");
    } else {
      setName("");
      setRoll("");
      setBranch("Computer Science");
      setYear("3rd Year");
      setStatus("Active");
      setError("");
    }
  }, [editingStudent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !roll.trim() || !branch.trim() || !year.trim()) {
      setError("Security check: Please fill out all registry parameters.");
      return;
    }

    const newStudent: Student = {
      id: editingStudent ? editingStudent.id : Date.now(),
      name: name.trim(),
      roll: roll.trim().toUpperCase(),
      branch,
      year,
      status,
    };

    onSave(newStudent);
    onClose();
  };

  const branches = [
    "Computer Science",
    "Electrical Eng",
    "Mechanical Eng",
    "Electronics & Comm",
    "Civil Engineering",
    "Bio-Technology"
  ];

  const years = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/5 bg-slate-950 p-6 md:p-8 shadow-2xl overflow-hidden">
        
        {/* Glow indicator line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Sparkles size={16} />
            </div>
            <h2 className="text-lg font-bold text-white">
              {editingStudent ? "Modify Student Profile" : "Register Student Node"}
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

          {/* Name input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Full Name</label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="e.g. Arjun Sharma"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
          </div>

          {/* Roll number input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">University Roll Number</label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="e.g. CS23001"
              value={roll}
              onChange={(e) => {
                setRoll(e.target.value);
                setError("");
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Branch dropdown select */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Branch Dept</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                {branches.map((b) => (
                  <option key={b} value={b} className="bg-slate-950 text-white">{b}</option>
                ))}
              </select>
            </div>

            {/* Year dropdown select */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Academic Year</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {years.map((y) => (
                  <option key={y} value={y} className="bg-slate-950 text-white">{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status select dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Audit Status</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-colors"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active" className="bg-slate-950 text-white">Active (Optimal Attendance)</option>
              <option value="Shortage" className="bg-slate-950 text-white">Shortage Alert (&lt;75% Attendance)</option>
            </select>
          </div>

          {/* Footer buttons row */}
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
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-xs font-semibold text-white rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.01]"
            >
              {editingStudent ? "Update Profile" : "Register Node"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default StudentModal;
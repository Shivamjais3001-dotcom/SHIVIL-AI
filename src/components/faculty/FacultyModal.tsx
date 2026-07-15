import { useEffect, useState } from "react";
import type { Faculty } from "../../types/faculty";
import { X, Sparkles, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faculty: Faculty) => void;
  editingFaculty: Faculty | null;
}

function FacultyModal({
  isOpen,
  onClose,
  onSave,
  editingFaculty,
}: Props) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingFaculty) {
      setName(editingFaculty.name);
      setDepartment(editingFaculty.department);
      setEmail(editingFaculty.email);
      setError("");
    } else {
      setName("");
      setDepartment("Computer Science");
      setEmail("");
      setError("");
    }
  }, [editingFaculty, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !department.trim() || !email.trim()) {
      setError("Please input all faculty parameter fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please input a valid email address.");
      return;
    }

    const newFaculty: Faculty = {
      id: editingFaculty ? editingFaculty.id : Date.now(),
      name: name.trim(),
      department,
      email: email.trim().toLowerCase(),
    };

    onSave(newFaculty);
    onClose();
  };

  const departments = [
    "Computer Science",
    "Electrical Eng",
    "Mechanical Eng",
    "Physics & EE",
    "Civil Engineering",
    "Mathematics",
    "Humanities & Management"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/5 bg-slate-950 p-6 md:p-8 shadow-2xl overflow-hidden">
        
        {/* Glow indicator line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Sparkles size={16} />
            </div>
            <h2 className="text-lg font-bold text-white">
              {editingFaculty ? "Modify Faculty Profile" : "Register Faculty Node"}
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
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Faculty Name</label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="e.g. Dr. Sarah Jenkins"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
            />
          </div>

          {/* Department Select dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Assigned Department</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d} value={d} className="bg-slate-950 text-white">{d}</option>
              ))}
            </select>
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">University Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              placeholder="e.g. sarah.jenkins@university.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
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
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-xs font-semibold text-white rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.01]"
            >
              {editingFaculty ? "Update Profile" : "Register Node"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default FacultyModal;
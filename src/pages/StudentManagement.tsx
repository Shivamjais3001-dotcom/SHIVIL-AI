import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import StudentHeader from "../components/students/StudentHeader";
import StudentTable from "../components/students/StudentTable";
import StudentModal from "../components/students/StudentModal";
import type { Student } from "../types/student";
import { studentService } from "../services/studentService";
import { AlertCircle } from "lucide-react";

function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const activeRole = localStorage.getItem("userRole") || "Admin";

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students", err);
      setError("Unable to connect to the students registry terminal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on branch select and search input
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.roll.toLowerCase().includes(search.toLowerCase());
      const matchBranch = filterBranch === "All" || s.branch === filterBranch;
      return matchSearch && matchBranch;
    });
  }, [students, search, filterBranch]);

  const handleSave = async (studentData: Student) => {
    try {
      setError("");
      if (editingStudent && editingStudent.id !== undefined) {
        // Edit record call
        const updated = await studentService.update(editingStudent.id, studentData);
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? updated : s));
      } else {
        // Create record call
        const created = await studentService.create(studentData);
        setStudents(prev => [...prev, created]);
      }
      setShowModal(false);
      setEditingStudent(null);
    } catch (err: any) {
      console.error("Failed to save student", err);
      setError(err.message || "Failed to commit student profile.");
    }
  };

  const handleDelete = async (id: number) => {
    if (activeRole !== "Admin") {
      setError("Access denied. Admin authorization required for student deletion.");
      return;
    }
    try {
      setError("");
      await studentService.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Delete student failed", err);
      setError("Failed to remove student record.");
    }
  };

  const handleEdit = (student: Student) => {
    if (activeRole === "Student") {
      setError("Access denied. Administrative authority required to edit profiles.");
      return;
    }
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleAdd = () => {
    if (activeRole === "Student") {
      setError("Access denied. Administrative authority required to add profiles.");
      return;
    }
    setEditingStudent(null);
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen bg-[#030712]">
      <Sidebar />

      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-3xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0 animate-pulse" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Header controls */}
          <StudentHeader
            search={search}
            setSearch={setSearch}
            onAdd={handleAdd}
            total={students.length}
          />

          {/* Registry list table */}
          {loading ? (
            <div className="rounded-3xl border border-white/5 bg-slate-950/20 p-8 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-900 rounded w-1/4" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4 py-3 border-b border-slate-900/60">
                  <div className="w-10 h-10 bg-slate-900 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-900 rounded w-1/3" />
                    <div className="h-3 bg-slate-900 rounded w-1/4" />
                  </div>
                  <div className="w-20 h-6 bg-slate-900 rounded self-center" />
                </div>
              ))}
            </div>
          ) : (
            <StudentTable
              students={filteredStudents}
              search={search}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {/* Add/Edit modal dialog box */}
          <StudentModal
            isOpen={showModal}
            editingStudent={editingStudent}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingStudent(null);
            }}
          />

        </div>
      </main>
    </div>
  );
}

export default StudentManagement;
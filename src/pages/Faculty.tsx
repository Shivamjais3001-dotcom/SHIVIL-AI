import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import FacultyHeader from "../components/faculty/FacultyHeader";
import FacultyTable from "../components/faculty/FacultyTable";
import FacultyModal from "../components/faculty/FacultyModal";
import FacultyWorkspace from "../components/faculty/FacultyWorkspace";
import type { Faculty } from "../types/faculty";
import { facultyService } from "../services/facultyService";
import { AlertCircle } from "lucide-react";

function FacultyManagement() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const activeRole = localStorage.getItem("userRole") || "Admin";

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await facultyService.getAll();
      setFaculty(data);
    } catch (err) {
      console.error("Failed to load faculty", err);
      setError("Unable to connect to the faculty directory terminal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const filteredFaculty = useMemo(() => {
    return faculty.filter((f) => {
      const matchSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.email.toLowerCase().includes(search.toLowerCase());
      const matchDept = filterDept === "All" || f.department === filterDept;
      return matchSearch && matchDept;
    });
  }, [faculty, search, filterDept]);

  const handleSave = async (facultyData: Faculty) => {
    try {
      setError("");
      if (editingFaculty) {
        // Edit record
        const updated = await facultyService.update(editingFaculty.id, facultyData);
        setFaculty(prev => prev.map(f => f.id === editingFaculty.id ? updated : f));
      } else {
        // Create record
        const created = await facultyService.create(facultyData);
        setFaculty(prev => [...prev, created]);
      }
      setShowModal(false);
      setEditingFaculty(null);
    } catch (err) {
      console.error("Failed to commit faculty", err);
      setError("Failed to save professor profile.");
    }
  };

  const handleDelete = async (id: number) => {
    if (activeRole !== "Admin") {
      setError("Access denied. Admin credentials required for profile deletion.");
      return;
    }
    try {
      setError("");
      await facultyService.delete(id);
      setFaculty(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error("Delete faculty failed", err);
      setError("Failed to delete professor profile.");
    }
  };

  const handleEdit = (professor: Faculty) => {
    if (activeRole === "Student") {
      setError("Access denied. Admin/Faculty authority required.");
      return;
    }
    setEditingFaculty(professor);
    setShowModal(true);
  };

  const handleAdd = () => {
    if (activeRole === "Student") {
      setError("Access denied. Admin authority required.");
      return;
    }
    setEditingFaculty(null);
    setShowModal(true);
  };

  if (selectedFaculty) {
    return (
      <div className="flex min-h-screen bg-[#030712]">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0">
          <div className="max-w-7xl mx-auto">
            <FacultyWorkspace 
              professor={selectedFaculty} 
              onBack={() => setSelectedFaculty(null)} 
              onEdit={(f) => {
                setSelectedFaculty(null);
                handleEdit(f);
              }} 
            />
          </div>
        </main>
      </div>
    );
  }

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
          <FacultyHeader
            search={search}
            setSearch={setSearch}
            onAdd={handleAdd}
            total={faculty.length}
          />

          {/* Directory list table */}
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
            <FacultyTable
              faculty={filteredFaculty}
              search={search}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewWorkspace={setSelectedFaculty}
            />
          )}

          {/* Add/Edit modal dialog box */}
          <FacultyModal
            isOpen={showModal}
            editingFaculty={editingFaculty}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingFaculty(null);
            }}
          />

        </div>
      </main>
    </div>
  );
}

export default FacultyManagement;
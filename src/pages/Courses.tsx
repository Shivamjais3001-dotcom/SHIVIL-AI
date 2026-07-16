import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import CourseHeader from "../components/courses/CourseHeader";
import CourseTable from "../components/courses/CourseTable";
import CourseModal from "../components/courses/CourseModal";
import CourseWorkspace from "../components/courses/CourseWorkspace";
import type { CourseType } from "../types/course";
import { courseService } from "../services/courseService";
import { AlertCircle } from "lucide-react";

function Courses() {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseType | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);

  const activeRole = localStorage.getItem("userRole") || "Admin";

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses", err);
      setError("Unable to connect to the curriculum database terminal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter search queries
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchSearch = course.courseName.toLowerCase().includes(search.toLowerCase()) ||
                          course.courseCode.toLowerCase().includes(search.toLowerCase());
      const matchDept = filterDept === "All" || course.department === filterDept;
      
      return matchSearch && matchDept;
    });
  }, [courses, search, filterDept]);

  const handleSave = async (courseData: CourseType) => {
    try {
      setError("");
      if (editingCourse) {
        // Edit course record
        const updated = await courseService.update(editingCourse.id, courseData);
        setCourses(prev => prev.map((c) => (c.id === editingCourse.id ? updated : c)));
      } else {
        // Create course record
        const created = await courseService.create(courseData);
        setCourses(prev => [...prev, created]);
      }
      setShowModal(false);
      setEditingCourse(null);
    } catch (err) {
      console.error("Failed to commit course syllabus", err);
      setError("Failed to save course parameters.");
    }
  };

  const handleDelete = async (id: number) => {
    if (activeRole === "Student") {
      setError("Access denied. Admin/Faculty credentials required to delete syllabus.");
      return;
    }
    try {
      setError("");
      await courseService.delete(id);
      setCourses(prev => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete course failed", err);
      setError("Failed to remove course from catalog.");
    }
  };

  const handleEdit = (courseData: CourseType) => {
    if (activeRole === "Student") {
      setError("Access denied. Admin/Faculty clearance required.");
      return;
    }
    setEditingCourse(courseData);
    setShowModal(true);
  };

  const handleAdd = () => {
    if (activeRole === "Student") {
      setError("Access denied. Admin/Faculty clearance required.");
      return;
    }
    setEditingCourse(null);
    setShowModal(true);
  };

  if (selectedCourse) {
    return (
      <div className="flex min-h-screen bg-[#030712]">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto min-w-0">
          <div className="max-w-7xl mx-auto">
            <CourseWorkspace 
              course={selectedCourse} 
              onBack={() => setSelectedCourse(null)} 
              onEdit={(c) => {
                setSelectedCourse(null);
                handleEdit(c);
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

          {/* Header query controllers */}
          <CourseHeader
            search={search}
            setSearch={setSearch}
            filterDept={filterDept}
            setFilterDept={setFilterDept}
            onAdd={handleAdd}
            total={courses.length}
          />

          {/* Curriculum Records Grid */}
          {loading ? (
            <div className="rounded-3xl border border-white/5 bg-slate-950/20 p-8 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-900 rounded w-1/4" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-4 py-4 border-b border-slate-900/60">
                  <div className="w-8 h-8 bg-slate-900 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-900 rounded w-1/2" />
                    <div className="h-3 bg-slate-900 rounded w-1/3" />
                  </div>
                  <div className="w-16 h-6 bg-slate-900 rounded self-center" />
                </div>
              ))}
            </div>
          ) : (
            <CourseTable
              courses={filteredCourses}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewWorkspace={setSelectedCourse}
            />
          )}

          {/* Add/Edit modal dialog popup */}
          <CourseModal
            isOpen={showModal}
            editingCourse={editingCourse}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingCourse(null);
            }}
          />

        </div>
      </main>
    </div>
  );
}

export default Courses;
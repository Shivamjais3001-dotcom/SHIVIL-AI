// Frontend API Service for Examination Engine — Sprint 8

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...options
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "API error");
  return json.data;
}

export const examinationService = {
  // ─── EXAMS ──────────────────────────────────────────────────────
  getExams: (params?: Record<string, any>) => {
    const q = new URLSearchParams(params || {}).toString();
    return apiFetch(`/examination/exams${q ? "?" + q : ""}`);
  },
  getExamById: (id: string) => apiFetch(`/examination/exams/${id}`),
  getExamCalendar: (limit?: number) => apiFetch(`/examination/exams/calendar?limit=${limit || 20}`),
  createExam: (data: any) => apiFetch("/examination/exams", { method: "POST", body: JSON.stringify(data) }),
  updateExam: (id: string, data: any) => apiFetch(`/examination/exams/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  lockExam: (id: string) => apiFetch(`/examination/exams/${id}/lock`, { method: "POST" }),
  deleteExam: (id: string) => apiFetch(`/examination/exams/${id}`, { method: "DELETE" }),
  checkConflicts: (params: any) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/examination/exams/conflicts?${q}`);
  },

  // ─── COMPONENTS ─────────────────────────────────────────────────
  setComponents: (data: any) => apiFetch("/examination/components", { method: "POST", body: JSON.stringify(data) }),
  getComponents: (subjectId: string) => apiFetch(`/examination/components/${subjectId}`),

  // ─── MARKS ──────────────────────────────────────────────────────
  enterMarks: (data: any) => apiFetch("/examination/marks/entry", { method: "POST", body: JSON.stringify(data) }),
  bulkEnterMarks: (data: any) => apiFetch("/examination/marks/bulk", { method: "POST", body: JSON.stringify(data) }),
  moderateMarks: (id: string, data: any) => apiFetch(`/examination/marks/${id}/moderate`, { method: "PUT", body: JSON.stringify(data) }),
  approveMarks: (id: string, data: any) => apiFetch(`/examination/marks/${id}/approve`, { method: "PUT", body: JSON.stringify(data) }),
  lockMarks: (examId: string) => apiFetch(`/examination/marks/${examId}/lock-all`, { method: "POST" }),
  getMarksByExam: (examId: string) => apiFetch(`/examination/marks/exam/${examId}`),
  getStudentMarks: (studentId: string, params?: any) => {
    const q = new URLSearchParams(params || {}).toString();
    return apiFetch(`/examination/marks/student/${studentId}${q ? "?" + q : ""}`);
  },
  getPendingApprovals: () => apiFetch("/examination/marks/pending-approvals"),

  // ─── RE-EVALUATION ──────────────────────────────────────────────
  requestReEval: (data: any) => apiFetch("/examination/reevaluation", { method: "POST", body: JSON.stringify(data) }),
  getReEvaluations: (params?: any) => {
    const q = new URLSearchParams(params || {}).toString();
    return apiFetch(`/examination/reevaluation${q ? "?" + q : ""}`);
  },

  // ─── GRADING ────────────────────────────────────────────────────
  setGradingPolicy: (data: any) => apiFetch("/examination/grading/policy", { method: "POST", body: JSON.stringify(data) }),
  getGradingPolicy: () => apiFetch("/examination/grading/policy"),
  simulateGrade: (data: any) => apiFetch("/examination/grading/simulate", { method: "POST", body: JSON.stringify(data) }),

  // ─── RESULTS ────────────────────────────────────────────────────
  processResult: (data: any) => apiFetch("/examination/results/process", { method: "POST", body: JSON.stringify(data) }),
  getStudentResults: (studentId: string) => apiFetch(`/examination/results/student/${studentId}`),
  getTranscript: (studentId: string) => apiFetch(`/examination/results/transcript/${studentId}`),
  getSemesterResults: (params?: any) => {
    const q = new URLSearchParams(params || {}).toString();
    return apiFetch(`/examination/results/semester${q ? "?" + q : ""}`);
  },
  getBacklogStudents: () => apiFetch("/examination/results/backlogs"),

  // ─── ANALYTICS ──────────────────────────────────────────────────
  getAnalyticsDashboard: () => apiFetch("/examination/analytics/dashboard"),
  getDepartmentComparison: () => apiFetch("/examination/analytics/department"),
  getSubjectDifficulty: () => apiFetch("/examination/analytics/subject-difficulty"),
  getCGPADistribution: () => apiFetch("/examination/analytics/cgpa-distribution"),
  getTopPerformers: (params?: any) => {
    const q = new URLSearchParams(params || {}).toString();
    return apiFetch(`/examination/analytics/top-performers${q ? "?" + q : ""}`);
  },
  getPerformanceTrends: () => apiFetch("/examination/analytics/trends"),
  getBacklogAnalytics: () => apiFetch("/examination/analytics/backlogs")
};

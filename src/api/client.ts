import axios from "axios";

// Access token memory cache
let memAccessToken: string | null = localStorage.getItem("accessToken");

export const setAccessToken = (token: string | null) => {
  memAccessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const getAccessToken = () => memAccessToken;

// Setup API endpoint base URL (pointing to the local backend port 5000)
export const API_BASE_URL = "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

// Request Interceptor: Attach bearer authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth refresh rotation and offline mock fallbacks
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Silent refresh rotation handling for 401 unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt rotation via refresh token
        const refreshResponse = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
        const newAccessToken = refreshResponse.data?.data?.accessToken;
        
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        // Refresh token expired or invalid; clear auth and redirect
        setAccessToken(null);
        localStorage.removeItem("userRole");
        localStorage.removeItem("adminName");
        window.dispatchEvent(new Event("auth-logout"));
      }
    }

    // 2. Offline Hybrid Fallback Layer: Intercept network connect errors
    if (!error.response) {
      console.warn("⚠️ SHIVIL AI: Local backend server offline. Activating hybrid offline fallback layer.");
      
      const url = originalRequest.url || "";
      const method = originalRequest.method?.toUpperCase() || "GET";

      // Match routes and return mock data in standard backend envelopes
      if (url.includes("/dashboard/metrics")) {
        return {
          data: {
            success: true,
            message: "Metrics loaded from offline fallback store.",
            data: {
              studentsCount: 1240,
              facultyCount: 142,
              departmentsCount: 4,
              averageAttendance: 94.2,
              upcomingExamsCount: 6,
              pendingTasks: 3,
              activeConversations: 12
            }
          }
        };
      }

      if (url.includes("/students")) {
        const stored = localStorage.getItem("students");
        const studentList = stored ? JSON.parse(stored) : [
          { id: "s-1", name: "Neha Reddy", rollNo: "APEX-2026-002", branch: "Computer Science", semester: "6th", academicYear: "2026", parentName: "R. Reddy", parentContact: "+91 98765 43210" },
          { id: "s-2", name: "Anya Sen", rollNo: "APEX-2026-044", branch: "Information Tech", semester: "6th", academicYear: "2026", parentName: "A. Sen", parentContact: "+91 98765 43211" }
        ];

        if (method === "GET") {
          return {
            data: {
              success: true,
              message: "Student list returned from local storage cache.",
              data: studentList,
              meta: { page: 1, limit: 10, total: studentList.length, pages: 1 }
            }
          };
        } else if (method === "POST") {
          const body = JSON.parse(originalRequest.data);
          const newStudent = { id: `s-${Date.now()}`, ...body };
          studentList.push(newStudent);
          localStorage.setItem("students", JSON.stringify(studentList));
          return {
            data: {
              success: true,
              message: "Student created in local storage cache.",
              data: newStudent
            }
          };
        }
      }

      if (url.includes("/faculty")) {
        const stored = localStorage.getItem("faculty");
        const facultyList = stored ? JSON.parse(stored) : [
          { id: "f-1", name: "Dr. Sarah Jenkins", department: "Computer Science", specialty: "AI/ML", teachingScore: 9.4, researchScore: 8.8, feedbackScore: 9.6 },
          { id: "f-2", name: "Prof. Marcus Vance", department: "Information Tech", specialty: "Distributed Systems", teachingScore: 9.1, researchScore: 8.2, feedbackScore: 9.4 }
        ];

        if (method === "GET") {
          return {
            data: {
              success: true,
              message: "Faculty list returned from local storage cache.",
              data: facultyList,
              meta: { page: 1, limit: 10, total: facultyList.length, pages: 1 }
            }
          };
        }
      }

      if (url.includes("/courses")) {
        const courseList = [
          { code: "CS-302", name: "Analysis of Algorithms", credits: 4, semester: "6th" },
          { code: "IT-310", name: "Distributed Systems", credits: 3, semester: "6th" }
        ];
        return {
          data: {
            success: true,
            message: "Courses list returned from offline catalog.",
            data: courseList
          }
        };
      }

      if (url.includes("/attendance")) {
        const attendanceLogs = [
          { date: "2026-07-16", status: "PRESENT", studentId: "s-1", subjectId: "sub-1" },
          { date: "2026-07-16", status: "ABSENT", studentId: "s-2", subjectId: "sub-1" }
        ];
        return {
          data: {
            success: true,
            message: "Attendance logs returned from offline register.",
            data: attendanceLogs
          }
        };
      }

      if (url.includes("/ai/conversations")) {
        const chatLogs = [
          { history: [{ role: "assistant", text: "Hello! Shivil AI OS Terminal is ready." }] }
        ];
        return {
          data: {
            success: true,
            message: "AI chats loaded from local offline store.",
            data: chatLogs
          }
        };
      }
    }

    return Promise.reject(error);
  }
);

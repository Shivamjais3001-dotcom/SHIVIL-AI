import express from "express";
import cookieParser from "cookie-parser";

// Centralized Middlewares
import { requestIdMiddleware } from "../common/middleware/requestId.middleware";
import { loggingMiddleware } from "../common/middleware/logging.middleware";
import { securityMiddleware } from "../common/middleware/security.middleware";
import { errorHandler } from "../common/middleware/errorHandler.middleware";
import { ApiResponse } from "../common/responses/ApiResponse";

// Database
import prisma from "../config/database";

// Modular Feature Route imports
import authRoutes from "../modules/auth/auth.routes";
import studentRoutes from "../routes/student.routes";
import facultyRoutes from "../routes/faculty.routes";
import courseRoutes from "../routes/course.routes";
import departmentRoutes from "../routes/department.routes";
import subjectRoutes from "../routes/subject.routes";
import attendanceRoutes from "../routes/attendance.routes";
import aiRoutes from "../routes/ai.routes";
import dashboardRoutes from "../routes/dashboard.routes";
import timetableRoutes from "../routes/timetable.routes";
import academicRoutes from "../routes/academic.routes";
import examinationRoutes from "../routes/examination.routes";

const app = express();

// 1. Request Tracing (must be first to trace all actions)
app.use(requestIdMiddleware);

// 2. Security Middleware (Helmet, CORS, Compression, Rate Limiter)
securityMiddleware(app);

// 3. Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Request Logging (Morgan + Winston)
app.use(loggingMiddleware);

// 5. Health Check Endpoint
app.get("/health", async (req, res, next) => {
  try {
    let dbStatus = "unreachable";
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "connected";
    } catch (error) {
      dbStatus = `error: ${(error as Error).message}`;
    }

    const healthData = {
      status: dbStatus === "connected" ? "healthy" : "unhealthy",
      timestamp: new Date(),
      uptime: `${Math.floor(process.uptime())}s`,
      database: dbStatus,
      memory: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`
    };

    if (healthData.status === "healthy") {
      res.status(200).json(ApiResponse.success("Server is healthy", healthData));
    } else {
      res.status(503).json(ApiResponse.error("Server is unhealthy", healthData));
    }
  } catch (error) {
    next(error);
  }
});

// 6. API Routes (v1)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/timetable", timetableRoutes);
app.use("/api/v1/academic", academicRoutes);
app.use("/api/v1/examination", examinationRoutes);

// Temporarily map /api to /api/v1 for backward compatibility
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/examination", examinationRoutes);

// 7. Unknown Route Handler
app.use((req, res) => {
  res.status(404).json(ApiResponse.error("Route not found"));
});

// 8. Global Error Handler
app.use(errorHandler);

export default app;

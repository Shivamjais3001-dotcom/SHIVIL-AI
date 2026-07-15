import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

// Route imports
import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import facultyRoutes from "./routes/faculty.routes";
import courseRoutes from "./routes/course.routes";
import departmentRoutes from "./routes/department.routes";
import subjectRoutes from "./routes/subject.routes";
import attendanceRoutes from "./routes/attendance.routes";
import aiRoutes from "./routes/ai.routes";
import dashboardRoutes from "./routes/dashboard.routes";

// Middlewares
import { errorMiddleware } from "./middlewares/error.middleware";
import { responseNormalizer } from "./middlewares/response.middleware";

const app = express();

// Mounting global response formatter normalizer first
app.use(responseNormalizer);

// Security Middlewares configuration
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
}));

// API Rate limiting to protect endpoints against brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  limit: 100, // Limit each IP to 100 requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests from this IP terminal session. Rate limit reached."
});
app.use("/api", limiter);

// Request parsing body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Mounting modular API routers
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Centralized error interceptor handler
app.use(errorMiddleware);

export default app;

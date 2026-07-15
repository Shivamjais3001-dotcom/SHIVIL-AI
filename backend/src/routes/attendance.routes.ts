import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  startSessionSchema,
  studentCheckinSchema,
  facultyCheckinSchema
} from "../validators/attendance.validator";

const router = Router();
const attendanceController = new AttendanceController();

router.use(authenticate);

// Attendance Dashboard Sum Rates
router.get(
  "/dashboard/summary",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  attendanceController.getAttendanceDashboard
);

// Get anomalous check-ins list (GPS geofence or low face confidence)
router.get(
  "/anomalies",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  attendanceController.getAnomalies
);

// Get list of at-risk students below threshold
router.get(
  "/at-risk",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  attendanceController.getAtRiskStudents
);

// CSV Export route
router.get(
  "/export",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  attendanceController.exportReports
);

// Basic query list
router.get("/", attendanceController.getAttendance);

// Start new class attendance session (QR/GPS/Manual)
router.post(
  "/sessions",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  validate(startSessionSchema),
  attendanceController.startSession
);

// Close attendance session
router.put(
  "/sessions/:id/close",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  attendanceController.closeSession
);

// Student check-in endpoint (verifies session, location, face, QR)
router.post(
  "/checkin/student",
  validate(studentCheckinSchema),
  attendanceController.studentCheckin
);

// Faculty daily check-in / check-out
router.post(
  "/checkin/faculty",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  validate(facultyCheckinSchema),
  attendanceController.facultyCheckin
);

// Legacy post route alias for backward compatibility
router.post(
  "/",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  attendanceController.markAttendance
);

// AI predictions routes
router.get(
  "/predictions",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  attendanceController.getPredictions
);

router.post(
  "/predictions",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  attendanceController.predictAttendanceRates
);

export default router;

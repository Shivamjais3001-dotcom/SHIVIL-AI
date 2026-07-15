import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createStudentSchema, updateStudentSchema } from "../validators/student.validator";

const router = Router();
const studentController = new StudentController();

// Enforce active session authenticate middleware across all routes
router.use(authenticate);

// Student Dashboard Summary Metrics
router.get(
  "/dashboard/summary",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  studentController.getStudentDashboard
);

// Bulk Import & Export operations
router.post(
  "/import",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  studentController.bulkImport
);

router.get(
  "/export",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  studentController.bulkExport
);

// Basic CRUD Operations
router.get(
  "/", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"), 
  studentController.getStudents
);

router.get(
  "/:id", 
  studentController.getStudentById
);

router.get(
  "/:id/timeline",
  studentController.getStudentTimeline
);

router.get(
  "/:id/analytics",
  studentController.getStudentAnalytics
);

router.post(
  "/", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  validate(createStudentSchema), 
  studentController.createStudent
);

router.put(
  "/:id", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  validate(updateStudentSchema), 
  studentController.updateStudent
);

router.put(
  "/:id/archive",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  studentController.archiveStudent
);

router.put(
  "/:id/restore",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  studentController.restoreStudent
);

router.delete(
  "/:id", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  studentController.deleteStudent
);

export default router;

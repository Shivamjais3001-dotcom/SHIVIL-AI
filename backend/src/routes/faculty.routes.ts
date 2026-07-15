import { Router } from "express";
import { FacultyController } from "../controllers/faculty.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createFacultySchema, updateFacultySchema } from "../validators/faculty.validator";

const router = Router();
const facultyController = new FacultyController();

// Enforce active session authenticate middleware across all routes
router.use(authenticate);

// Faculty Dashboard Summary Metrics
router.get(
  "/dashboard/summary",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  facultyController.getFacultyDashboard
);

// Bulk Import & Export operations
router.post(
  "/import",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  facultyController.bulkImport
);

router.get(
  "/export",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  facultyController.bulkExport
);

// Basic CRUD Operations
router.get(
  "/", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  facultyController.getFaculty
);

router.get(
  "/:id", 
  facultyController.getFacultyById
);

router.get(
  "/:id/timeline",
  facultyController.getFacultyTimeline
);

router.get(
  "/:id/workload",
  facultyController.getWorkload
);

router.post(
  "/", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  validate(createFacultySchema), 
  facultyController.createFaculty
);

router.put(
  "/:id", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  validate(updateFacultySchema), 
  facultyController.updateFaculty
);

router.put(
  "/:id/archive",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  facultyController.archiveFaculty
);

router.put(
  "/:id/restore",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  facultyController.restoreFaculty
);

router.delete(
  "/:id", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  facultyController.deleteFaculty
);

// Leave administration management
router.post(
  "/:id/leaves",
  facultyController.applyLeave
);

router.put(
  "/:id/leaves/:requestId",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD"),
  facultyController.approveRejectLeave
);

export default router;

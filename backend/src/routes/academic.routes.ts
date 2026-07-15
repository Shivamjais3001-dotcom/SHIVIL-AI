import { Router } from "express";
import { AcademicController } from "../controllers/academic.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createProgramSchema,
  createClassroomSchema,
  createOfferingSchema,
  enrollStudentSchema,
  createCalendarEventSchema
} from "../validators/academic.validator";

const router = Router();
const academicController = new AcademicController();

router.use(authenticate);

// Dashboard metrics
router.get(
  "/dashboard/summary",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"),
  academicController.getAcademicDashboard
);

// Programs
router.post(
  "/programs",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  validate(createProgramSchema),
  academicController.createProgram
);

router.get("/programs", academicController.getPrograms);

// Classrooms
router.post(
  "/classrooms",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  validate(createClassroomSchema),
  academicController.createClassroom
);

router.get("/classrooms", academicController.getClassrooms);

// Course Offerings
router.post(
  "/offerings",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD"),
  validate(createOfferingSchema),
  academicController.createOffering
);

router.get("/offerings", academicController.getOfferings);

// Enrollments Engine
router.post(
  "/enrollments",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "STUDENT"),
  validate(enrollStudentSchema),
  academicController.enrollStudent
);

router.post(
  "/enrollments/drop",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "STUDENT"),
  validate(enrollStudentSchema),
  academicController.dropStudent
);

router.get("/enrollments", academicController.getEnrollments);

// Academic Calendar Events
router.post(
  "/calendar",
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"),
  validate(createCalendarEventSchema),
  academicController.createCalendarEvent
);

router.get("/calendar", academicController.getCalendarEvents);

export default router;

import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createStudentSchema, updateStudentSchema } from "../validators/student.validator";

const router = Router();
const studentController = new StudentController();

// Enforce active session auth on all student operations
router.use(authenticate);

router.get(
  "/", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"), 
  studentController.getStudents
);

router.get(
  "/:id", 
  studentController.getStudentById
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

router.delete(
  "/:id", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  studentController.deleteStudent
);

export default router;

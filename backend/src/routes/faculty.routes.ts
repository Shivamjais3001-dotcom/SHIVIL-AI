import { Router } from "express";
import { FacultyController } from "../controllers/faculty.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createFacultySchema, updateFacultySchema } from "../validators/faculty.validator";

const router = Router();
const facultyController = new FacultyController();

// Enforce active session auth on all faculty operations
router.use(authenticate);

router.get(
  "/", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  facultyController.getFaculty
);

router.get(
  "/:id", 
  facultyController.getFacultyById
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

router.delete(
  "/:id", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  facultyController.deleteFaculty
);

export default router;

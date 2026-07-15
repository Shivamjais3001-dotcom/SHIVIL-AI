import { Router } from "express";
import { SubjectController } from "../controllers/subject.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createSubjectSchema, updateSubjectSchema } from "../validators/subject.validator";

const router = Router();
const subjectController = new SubjectController();

router.use(authenticate);

router.get("/", subjectController.getSubjects);
router.get("/:id", subjectController.getSubjectById);

router.post(
  "/", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  validate(createSubjectSchema), 
  subjectController.createSubject
);

router.put(
  "/:id", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  validate(updateSubjectSchema), 
  subjectController.updateSubject
);

router.delete(
  "/:id", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  subjectController.deleteSubject
);

export default router;

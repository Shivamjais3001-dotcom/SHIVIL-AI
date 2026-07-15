import { Router } from "express";
import { TimetableController } from "../controllers/timetable.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createTimetableSchema } from "../validators/timetable.validator";

const router = Router();
const timetableController = new TimetableController();

router.use(authenticate);

router.get("/", timetableController.getTimetable);
router.get("/:id", timetableController.getTimetableById);

router.post(
  "/", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD"), 
  validate(createTimetableSchema), 
  timetableController.createTimetable
);

router.delete(
  "/:id", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD"), 
  timetableController.deleteTimetable
);

export default router;

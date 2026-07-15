import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createAttendanceSchema } from "../validators/attendance.validator";

const router = Router();
const attendanceController = new AttendanceController();

router.use(authenticate);

router.get("/", attendanceController.getAttendance);
router.post(
  "/", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN", "FACULTY"), 
  validate(createAttendanceSchema), 
  attendanceController.markAttendance
);

export default router;

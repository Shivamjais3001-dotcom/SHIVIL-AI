import { Router } from "express";
import { AttendanceController } from "../controllers/attendance.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();
const attendanceController = new AttendanceController();

router.use(authMiddleware);

router.get("/", attendanceController.getAttendance);
router.post("/", authorizeRoles("SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD", "FACULTY"), attendanceController.markAttendance);

export default router;

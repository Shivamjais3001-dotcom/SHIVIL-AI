import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();
const studentController = new StudentController();

// All students routes require active session JWT authorization
router.use(authMiddleware);

router.get("/", authorizeRoles("SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD", "FACULTY"), studentController.getStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", authorizeRoles("SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD"), studentController.createStudent);
router.put("/:id", authorizeRoles("SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD"), studentController.updateStudent);
router.delete("/:id", authorizeRoles("SUPER_ADMIN", "UNIVERSITY_ADMIN"), studentController.deleteStudent);

export default router;

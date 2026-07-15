import { Router } from "express";
import { FacultyController } from "../controllers/faculty.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();
const facultyController = new FacultyController();

router.use(authMiddleware);

router.get("/", facultyController.getFaculty);
router.post("/", authorizeRoles("SUPER_ADMIN", "UNIVERSITY_ADMIN"), facultyController.createFaculty);

export default router;

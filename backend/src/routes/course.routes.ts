import { Router } from "express";
import { CourseController } from "../controllers/course.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();
const courseController = new CourseController();

router.use(authMiddleware);

router.get("/", courseController.getCourses);
router.post("/", authorizeRoles("SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD"), courseController.createCourse);
router.put("/:id", authorizeRoles("SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD"), courseController.updateCourse);
router.delete("/:id", authorizeRoles("SUPER_ADMIN", "UNIVERSITY_ADMIN", "HOD"), courseController.deleteCourse);

export default router;

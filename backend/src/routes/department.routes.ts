import { Router } from "express";
import { DepartmentController } from "../controllers/department.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createDepartmentSchema, updateDepartmentSchema } from "../validators/department.validator";

const router = Router();
const departmentController = new DepartmentController();

router.use(authenticate);

router.get("/", departmentController.getDepartments);
router.get("/:id", departmentController.getDepartmentById);

router.post(
  "/", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  validate(createDepartmentSchema), 
  departmentController.createDepartment
);

router.put(
  "/:id", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  validate(updateDepartmentSchema), 
  departmentController.updateDepartment
);

router.delete(
  "/:id", 
  authorize("SUPER_ADMIN", "UNIVERSITY_ADMIN"), 
  departmentController.deleteDepartment
);

export default router;

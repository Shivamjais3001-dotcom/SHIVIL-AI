import { Router } from "express";
import { AIController } from "../controllers/ai.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const aiController = new AIController();

router.use(authMiddleware);

router.get("/conversations", aiController.getConversations);
router.post("/conversations", aiController.saveConversation);

export default router;

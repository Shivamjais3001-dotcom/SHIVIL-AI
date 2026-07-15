import { Router } from "express";
import { AIController } from "../controllers/ai.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const aiController = new AIController();

router.use(authenticate);

router.get("/conversations", aiController.getConversations);
router.post("/conversations", aiController.saveConversation);

export default router;

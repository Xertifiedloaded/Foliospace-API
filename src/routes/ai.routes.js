import express from "express"
import * as aiController from "../controllers/ai.controller.js"
import { authenticateToken } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/agent", authenticateToken, aiController.processAIRequest)

export default router

import express from "express"
import * as analyticsController from "../../src/controllers/analytics.controller.js"
import { authenticateToken } from "../../src/middleware/auth.middleware.js"

const router = express.Router()

router.post("/track", analyticsController.trackVisit)
router.get("/stats", authenticateToken, analyticsController.getStats)

export default router

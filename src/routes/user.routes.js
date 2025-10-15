import express from "express"
import * as userController from "../../src/controllers/user.controller.js"
import { authenticateToken } from "../../src/middleware/auth.middleware.js"

const router = express.Router()

router.get("/skills", userController.getUserSkills)
router.get("/template", authenticateToken, userController.getTemplate)
router.put("/template", authenticateToken, userController.updateTemplate)

export default router

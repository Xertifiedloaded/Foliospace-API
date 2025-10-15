import express from "express"
import * as uploadController from "../../src/controllers/upload.controller.js"
import { authenticateToken } from "../../src/middleware/auth.middleware.js"

const router = express.Router()

router.post("/cv", authenticateToken, uploadController.uploadCV)

export default router

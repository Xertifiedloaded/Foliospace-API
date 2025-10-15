import express from "express"
import * as authController from "../../src/controllers/auth.controller.js"
import { authenticateToken } from "../../src/middleware/auth.middleware.js"

const router = express.Router()

router.post("/create", authController.register)
router.post("/login", authController.login)
router.post("/verify-otp", authController.verifyOtp)
router.post("/resend-otp", authController.resendOtp)
router.post("/forget-password", authController.forgetPassword)
router.post("/reset-password", authController.resetPassword)
router.post("/contact", authController.contact)
router.get("/session", authenticateToken, authController.getUserSession)

export default router

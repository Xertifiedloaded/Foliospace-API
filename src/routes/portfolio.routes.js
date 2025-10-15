import express from "express"
import * as portfolioController from "../../src/controllers/portfolio.controller.js"
import { authenticateToken } from "../../src/middleware/auth.middleware.js"

const router = express.Router()

router.get("/dashboard", authenticateToken, portfolioController.getDashboard)
router.get("/profile/:username", portfolioController.getProfile)
router.put("/profile", authenticateToken, portfolioController.updateProfile)
router.post("/links", authenticateToken, portfolioController.addLink)
router.put("/links/:id", authenticateToken, portfolioController.updateLink)
router.delete("/links/:id", authenticateToken, portfolioController.deleteLink)
router.post("/education", authenticateToken, portfolioController.addEducation)
router.put("/education/:id", authenticateToken, portfolioController.updateEducation)
router.delete("/education/:id", authenticateToken, portfolioController.deleteEducation)
router.post("/experience", authenticateToken, portfolioController.addExperience)
router.put("/experience/:id", authenticateToken, portfolioController.updateExperience)
router.delete("/experience/:id", authenticateToken, portfolioController.deleteExperience)
router.post("/projects", authenticateToken, portfolioController.addProject)
router.put("/projects/:id", authenticateToken, portfolioController.updateProject)
router.delete("/projects/:id", authenticateToken, portfolioController.deleteProject)
router.post("/skills", authenticateToken, portfolioController.addSkill)
router.delete("/skills/:id", authenticateToken, portfolioController.deleteSkill)
router.post("/certificates", authenticateToken, portfolioController.addCertificate)
router.put("/certificates/:id", authenticateToken, portfolioController.updateCertificate)
router.delete("/certificates/:id", authenticateToken, portfolioController.deleteCertificate)

export default router

import express from "express"
import * as waitlistController from "../../src/controllers/waitlist.controller.js"

const router = express.Router()

router.post("/", waitlistController.addToWaitlist)
router.get("/", waitlistController.getWaitlist)

export default router

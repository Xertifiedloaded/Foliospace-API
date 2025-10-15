import express from "express"
import * as referenceController from "../../src/controllers/reference.controller.js"

const router = express.Router()

router.get("/", referenceController.getReferences)

export default router

import express from "express"
import * as blogController from "../../src/controllers/blog.controller.js"

const router = express.Router()

router.get("/:slug", blogController.getBlogPost)

export default router

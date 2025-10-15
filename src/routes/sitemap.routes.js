import express from "express"
import * as sitemapController from "../../src/controllers/sitemap.controller.js"

const router = express.Router()

router.get("/", sitemapController.generateSitemap)

export default router

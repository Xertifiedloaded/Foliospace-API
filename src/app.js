import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import userRoutes from "./routes/user.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import waitlistRoutes from "./routes/waitlist.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import referenceRoutes from "./routes/reference.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import sitemapRoutes from "./routes/sitemap.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "X-CSRF-Token",
      "X-Requested-With",
      "Accept",
      "Accept-Version",
      "Content-Length",
      "Content-MD5",
      "Content-Type",
      "Date",
      "X-Api-Version",
      "Authorization",
    ],
  }),
)
app.use(express.static(path.join(__dirname, "../public")));


app.get("/", (req, res) => {
  res.json({
    name: "Foliospace",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth/*",
      portfolio: "/api/portfolio/*",
      user: "/api/user/*",
      analytics: "/api/analytics/*",
      waitlist: "/api/waitlist/*",
      upload: "/api/upload/*",
      references: "/api/references/*",
      ai: "/api/ai/*",
      sitemap: "/api/sitemap/*",
      blog: "/api/blog/*",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.use("/api/auth", authRoutes)
app.use("/api/portfolio", portfolioRoutes)
app.use("/api/user", userRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/waitlist", waitlistRoutes)
app.use("/api/upload", uploadRoutes)
app.use("/api/references", referenceRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/sitemap", sitemapRoutes)
app.use("/api/blog", blogRoutes)

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

export default app

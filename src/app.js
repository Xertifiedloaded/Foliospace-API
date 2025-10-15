
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import healthRoutes from "./routes/health.js";
import userRoutes from "./routes/user.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import waitlistRoutes from "./routes/waitlist.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import referenceRoutes from "./routes/reference.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import sitemapRoutes from "./routes/sitemap.routes.js";
import blogRoutes from "./routes/blog.routes.js";

dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/health", healthRoutes);
app.use("/auth", authRoutes)
app.use("/portfolio", portfolioRoutes)
app.use("/user", userRoutes)
app.use("/analytics", analyticsRoutes)
app.use("/waitlist", waitlistRoutes)
app.use("/upload", uploadRoutes)
app.use("/references", referenceRoutes)
app.use("/ai", aiRoutes)
app.use("/sitemap", sitemapRoutes)
app.use("/blog", blogRoutes)

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;

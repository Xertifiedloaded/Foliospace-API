import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("\x1b[36m%s\x1b[0m", "╔════════════════════════════════════════╗");
  console.log("\x1b[36m%s\x1b[0m", "║     🚀 Express API Server Running     ║");
  console.log("\x1b[36m%s\x1b[0m", "╚════════════════════════════════════════╝");
  console.log("");
  console.log("\x1b[32m%s\x1b[0m", `🌐 Server:    http://localhost:${PORT}`);
  console.log("\x1b[32m%s\x1b[0m", `📋 Health:    http://localhost:${PORT}/api/health`);
  console.log("\x1b[32m%s\x1b[0m", `🔐 Auth:      http://localhost:${PORT}/api/auth/*`);
  console.log("");
  console.log("\x1b[33m%s\x1b[0m", "Environment:");
  console.log(`  NODE_ENV: ${process.env.NODE_ENV || "development"}`);
  console.log(`  SMTP_USER: ${process.env.SMTP_USER ? "✅ Configured" : "❌ Missing"}`);
  console.log(`  JWT_SECRET: ${process.env.JWT_SECRET ? "✅ Configured" : "❌ Missing"}`);
  console.log("");
  console.log("\x1b[90m%s\x1b[0m", "👀 Watching for changes... (nodemon)");
  console.log("\x1b[90m%s\x1b[0m", "Press CTRL+C to stop or type 'rs' to restart");
  console.log("");
});
process.on("SIGTERM", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});
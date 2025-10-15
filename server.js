
import express from "express";
import next from "next";
import dotenv from "dotenv";
import apiApp from "./src/app.js";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use("/api", apiApp);

server.all(/.*/, (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log("\x1b[36m%s\x1b[0m", "╔════════════════════════════════════════╗");
    console.log("\x1b[36m%s\x1b[0m", "║     🚀 Server Running like a thief     ║");
    console.log("\x1b[36m%s\x1b[0m", "╚════════════════════════════════════════╝");
    console.log("");
    console.log("\x1b[32m%s\x1b[0m", `🌐 Server:    http://localhost:${port}`);
    console.log("\x1b[32m%s\x1b[0m", `📋 Health:    http://localhost:${port}/api/health`);
    console.log("\x1b[32m%s\x1b[0m", `🔐 Auth:      http://localhost:${port}/api/auth/*`);
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
});

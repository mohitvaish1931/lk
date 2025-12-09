import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Starting LearnKins Development Environment...\n");

// Start backend server
console.log("📡 Starting Backend Server...");
const backend = spawn("npm", ["run", "dev"], {
  cwd: path.join(__dirname, "server"),
  stdio: "inherit",
  shell: true,
});

// Wait a bit for backend to start
setTimeout(() => {
  console.log("⚛️  Starting Frontend Development Server...");
  const frontend = spawn("npm", ["run", "dev"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  // Handle process termination
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down servers...");
    backend.kill("SIGINT");
    frontend.kill("SIGINT");
    process.exit();
  });

  frontend.on("close", (code) => {
    console.log(`Frontend process exited with code ${code}`);
    backend.kill();
  });
}, 3000);

backend.on("close", (code) => {
  console.log(`Backend process exited with code ${code}`);
});

console.log("✅ Development environment starting...");
console.log("📱 Frontend will be available at: http://localhost:5173");
console.log("🔧 Backend API will be available at: http://localhost:5000");
console.log("📊 API Health Check: http://localhost:5000/api/health");

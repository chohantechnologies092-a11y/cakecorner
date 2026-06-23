// Custom server wrapper for Hostinger App Platform
console.log("Starting Next.js Standalone Wrapper...");

// Force binding to all interfaces
process.env.HOSTNAME = '0.0.0.0';

// Hostinger passes port via PORT env var, default to 3000
const port = process.env.PORT || 3000;
process.env.PORT = port;

console.log(`Enforced HOSTNAME: ${process.env.HOSTNAME}`);
console.log(`Assigned PORT: ${process.env.PORT}`);

try {
  // Load the standalone Next.js server
  require('./.next/standalone/server.js');
} catch (err) {
  console.error("Failed to load standalone server. Did the build succeed?");
  console.error(err);
  process.exit(1);
}

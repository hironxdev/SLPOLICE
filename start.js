const { spawn } = require('child_process');
const path = require('path');

console.log("--------------------------------------------------");
console.log("🚀 CCID INTELLIGENCE SUITE: SYSTEM INITIALIZING...");
console.log("--------------------------------------------------");

// 1. Start the Forensic Backend
const backend = spawn('node', ['court-backend/server.js'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '8005' }
});

// 2. Start the SLIIT Frontend
const frontend = spawn('npx', ['next', 'start', 'court-frontend', '-p', '8080'], {
  stdio: 'inherit'
});

backend.on('error', (err) => console.error('[BACKEND ERROR]', err));
frontend.on('error', (err) => console.error('[FRONTEND ERROR]', err));

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});

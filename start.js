const { spawn } = require('child_process');
const path = require('path');

// RAILWAY PORT COMPLIANCE
const PORT = process.env.PORT || 3001;
console.log(`[ORCHESTRATOR] Initializing Unified CCID Environment on Port ${PORT}...`);

// 1. Start the High-Availability Intelligence Backend (Port 8005)
const backend = spawn('node', ['court-frontend/intelligence-server.js'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '8005' }
});

// 2. Start the SLIIT Portal Frontend (Railway Primary Port)
const frontend = spawn('npx', ['next', 'start', 'court-frontend', '-p', PORT.toString()], {
    stdio: 'inherit',
    env: { ...process.env }
});

backend.on('error', (err) => console.error('[BACKEND_CRITICAL_FAILURE]', err));
frontend.on('error', (err) => console.error('[FRONTEND_CRITICAL_FAILURE]', err));

process.on('SIGINT', () => {
    backend.kill();
    frontend.kill();
    process.exit();
});

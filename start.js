const { spawn } = require('child_process');
const path = require('path');

// RAILWAY COMPLIANCE: Root PORT is assigned by the platform
const PORT = process.env.PORT || 3001;
console.log(`[SYS] Initializing Unified Intelligence Portal on Port ${PORT}...`);

// Start the integrated Court Frontend & Intelligence Server
// We use 'npm start' inside court-frontend which is configured to handle the dual-service mode
const service = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'court-frontend'),
    stdio: 'inherit',
    shell: true, // Use shell to ensure npm is found and environment variables are parsed
    env: { ...process.env, PORT: PORT.toString() }
});

service.on('error', (err) => {
    console.error('[CRITICAL_INITIALIZATION_ERROR]', err);
});

process.on('SIGINT', () => {
    service.kill();
    process.exit();
});

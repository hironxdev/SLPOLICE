const path = require('path');

// FORCE the backend to listen on its dedicated internal port 8005
// to avoid collision with the Next.js frontend port (assigned by process.env.PORT)
process.env.PORT = '8005';

console.log(`[SYS] Initializing Forensic Intelligence Bridge on Port ${process.env.PORT}...`);
console.log(`[SYS] CWD: ${process.cwd()}`);
console.log(`[SYS] Target: ${path.resolve(__dirname, '../court-backend/server.js')}`);

// Boot the primary court backend from the sibling directory
try {
    // Verify dependencies are present to prevent silent failures in production
    require('express');
    const backendPath = path.resolve(__dirname, '../court-backend/server.js');
    require(backendPath);
    console.log(`[SYS] Forensic Backend successfully linked and established.`);
} catch (err) {
    console.error('[CRITICAL_BRIDGE_FAILURE] Dependencies or Backend Source not found.');
    console.error('Please ensure "npm run install:all" was executed successfully.');
    console.error(err);
    process.exit(1);
}

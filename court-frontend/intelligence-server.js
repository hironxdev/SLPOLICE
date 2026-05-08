const path = require('path');

// FORCE the backend to listen on its dedicated internal port 8005
// to avoid collision with the Next.js frontend port (assigned by process.env.PORT)
process.env.PORT = '8005';

console.log(`[SYS] Initializing Forensic Intelligence Bridge on Port ${process.env.PORT}...`);

// Boot the primary court backend from the sibling directory
try {
    require('../court-backend/server.js');
} catch (err) {
    console.error('[CRITICAL_BRIDGE_FAILURE] Could not locate or initialize court-backend/server.js');
    console.error(err);
    process.exit(1);
}

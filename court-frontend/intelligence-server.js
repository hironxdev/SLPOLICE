const express = require('express');
const next = require('next');
const path = require('path');

// THE MASTER INTEGRATED INTELLIGENCE GATEWAY
// This script merges the Forensic Backend and Next.js Frontend into a SINGLE PROCESS
// eliminating all proxy issues, port collisions, and 'Offline' status errors.

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

console.log(`[SYS] Initializing Unified Investigative Portal on Port ${PORT}...`);

app.prepare().then(() => {
    const server = express();

    // 1. Mount the Forensic Backend
    try {
        const backendApp = require('../court-backend/server.js');
        // The backend already uses app.use(...) for its routes starting with /api
        server.use(backendApp);
        console.log(`[SYS] Forensic Backend successfully integrated into Gateway.`);
    } catch (err) {
        console.error('[CRITICAL_INTEGRATION_FAILURE] Forensic Backend could not be linked.');
        console.error(err);
    }

    // 2. Handle all other routes with Next.js
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`[SYS] Unified Intelligence Hub is fully ONLINE at Port ${PORT}`);
        console.log(`[SYS] Access through: http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('[FATAL_BOOT_FAILURE] Unified Hub failed to initialize.');
    console.error(err);
    process.exit(1);
});

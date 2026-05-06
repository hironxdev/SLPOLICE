// This file redirects Railway to the actual Intelligence Suite orchestrator
console.log("[SYS] CCID Main Entry Redirecting to Unified Start Command...");
require('child_process').execSync('npm run start', { stdio: 'inherit' });

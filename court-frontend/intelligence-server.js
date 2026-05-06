const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const PORT = 8005; 
const SECRET_KEY = process.env.JWT_SECRET || "ccid-secure-secret-key-CHANGE-IN-PRODUCTION";

app.get('/api/v1/ping', (req, res) => res.json({ status: "online" }));

const DB_PATH = path.join(__dirname, 'database.json');

const initDB = () => {
    if (!fs.existsSync(DB_PATH)) {
        const initialData = { requests: [], auditLogs: [], visits: [], applications: [], users: [] };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    return JSON.parse(fs.readFileSync(DB_PATH));
};

let db = initDB();
const saveDB = () => fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

// SECURITY BYPASS: Instant Access Mode
const authenticateToken = (req, res, next) => {
    req.user = { username: 'INSTANT_ADMIN', role: 'Admin' };
    next();
};

app.post('/api/v1/auth/login', (req, res) => {
    const token = jwt.sign({ username: 'INSTANT_ADMIN', role: 'Admin' }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ access_token: token, token_type: 'bearer' });
});

app.get('/api/v1/admin/requests', authenticateToken, (req, res) => res.json(db.requests || []));
app.get('/api/v1/admin/visits', authenticateToken, (req, res) => res.json(db.visits || []));

// Utility routes...
app.post('/api/v1/forensics/log-visit', (req, res) => {
    try {
        const visit = {
            id: uuidv4(),
            timestamp: new Date(),
            ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
            user_agent: req.headers['user-agent'],
            source: req.body.source || 'Unknown',
            location: req.body.location || null,
            fingerprint: req.body.fingerprint || {}
        };
        
        if (!db.visits) db.visits = [];
        db.visits.unshift(visit); // Newest first
        // Keep only last 1000 visits to save space
        if (db.visits.length > 1000) db.visits = db.visits.slice(0, 1000);
        
        saveDB();
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Logging failure" });
    }
});

app.post('/api/v1/jobs/apply', async (req, res) => {
    try {
        const { name } = req.body;
        if (!db.applications) db.applications = [];
        db.applications.push({ ...req.body, id: uuidv4(), timestamp: new Date() });
        saveDB();
        res.status(201).json({ success: true, message: "Application received" });
    } catch (err) { res.status(500).json({ error: "Failure" }); }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SYS] Unified INTELLIGENCE Server active on port ${PORT}`);
});

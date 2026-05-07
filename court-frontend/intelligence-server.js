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

app.post('/api/v1/admin/intelligence/email-trace', authenticateToken, (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email target required" });
    
    // 1. COLLECT ALL DATA VECTORS
    const applications = (db.applications || []).filter(a => a.email === email);
    const visits = (db.visits || []).filter(v => v.email === email);
    
    if (applications.length === 0 && visits.length === 0) {
        return res.json({ status: "TARGET_NOT_FOUND", confidence: "0%" });
    }

    // 2. CONSTRUCT CORRELATED VECTORS
    const vectors = [
        ...applications.map(a => ({
            timestamp: a.timestamp,
            ip: a.ip_address || "Unknown",
            location: a.location ? `${a.location.lat}, ${a.location.lon}` : (a.forensics?.city_name || "City Trace Failure"),
            device: a.user_agent || "Generic Workspace Device",
            isp: a.forensics?.isp || "Internal Node"
        })),
        ...visits.map(v => ({
            timestamp: v.timestamp,
            ip: v.ip_address,
            location: v.location ? `${v.location.lat}, ${v.location.lon}` : (v.forensics?.city_name || "City Trace Failure"),
            device: v.user_agent,
            isp: v.forensics?.isp || "Local Node"
        }))
    ].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    // 3. CALCULATE FORENSIC CONFIDENCE
    const confidence = vectors.length > 3 ? "98%" : vectors.length > 1 ? "85%" : "65%";

    res.json({
        status: "LINK_ESTABLISHED",
        confidence,
        vectors
    });
});

app.get('/api/v1/admin/requests', authenticateToken, (req, res) => res.json(db.requests || []));
app.get('/api/v1/admin/visits', authenticateToken, (req, res) => res.json(db.visits || []));

// Utility routes...
app.post('/api/v1/forensics/log-visit', async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
        
        // ASYNC FORENSIC ENRICHMENT (Geo-IP Lookup)
        let forensics = {};
        try {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
            const geoData = await geoRes.json();
            if (geoData.status === 'success') {
                forensics = {
                    country_name: geoData.country,
                    country_code: geoData.countryCode,
                    region_name: geoData.regionName,
                    city_name: geoData.city,
                    zip_code: geoData.zip,
                    latitude: geoData.lat,
                    longitude: geoData.lon,
                    isp: geoData.isp,
                    organization: geoData.org,
                    as: geoData.as
                };
            }
        } catch (e) {
            console.error("[FORENSICS] Geo enrichment failed:", e.message);
        }

        // SESSION RECONCILIATION: Update last visit if recent (5 mins) 
        if (!db.visits) db.visits = [];
        const existingVisitIndex = db.visits.findIndex(v => 
            v.ip_address === ip && 
            v.user_agent === req.headers['user-agent'] &&
            (new Date() - new Date(v.timestamp)) < 300000 // 5 minutes
        );

        if (existingVisitIndex !== -1) {
            // Update the existing visit with BETTER location if provided
            if (req.body.location) {
                db.visits[existingVisitIndex].location = req.body.location;
                // Only overwrite city/ISP if it's missing (keep the first good guess)
                if (Object.keys(forensics).length > 0) {
                    db.visits[existingVisitIndex].forensics = {
                        ...db.visits[existingVisitIndex].forensics,
                        ...forensics
                    };
                }
                saveDB();
                return res.status(200).json({ success: true, mode: "REFINED" });
            }
            return res.json({ success: true, mode: "DUPLICATE_IGNORED" });
        }

        const visit = {
            id: uuidv4(),
            timestamp: new Date(),
            ip_address: ip,
            user_agent: req.headers['user-agent'],
            source: req.body.source || 'Unknown',
            location: req.body.location || null, // High-Precision GPS from browser
            forensics: forensics,               // ISP & City data from server
            fingerprint: req.body.fingerprint || {}
        };
        
        db.visits.unshift(visit);
        if (db.visits.length > 1000) db.visits = db.visits.slice(0, 1000);
        
        saveDB();
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Logging failure" });
    }
});

app.post('/api/v1/jobs/apply', async (req, res) => {
    try {
        const { email } = req.body;
        if (!db.applications) db.applications = [];
        db.applications.push({ ...req.body, id: uuidv4(), timestamp: new Date() });
        
        // Link email to visitor history for this IP
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
        if (db.visits) {
            db.visits.forEach(v => {
                if (v.ip_address === ip) v.email = email;
            });
        }
        
        saveDB();
        res.status(201).json({ success: true, message: "Application received" });
    } catch (err) { res.status(500).json({ error: "Failure" }); }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SYS] Unified INTELLIGENCE Server active on port ${PORT}`);
});

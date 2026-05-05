const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8000;
const SECRET_KEY = "ccid-secure-secret-key";
const DB_PATH = path.join(__dirname, 'database.json');

// Initialize Simple File DB
const initDB = () => {
    if (!fs.existsSync(DB_PATH)) {
        const initialData = { requests: [], auditLogs: [], visits: [], users: [
            { id: uuidv4(), username: 'admin', password: bcrypt.hashSync('admin123', 10), role: 'Admin' }
        ]};
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    const data = JSON.parse(fs.readFileSync(DB_PATH));
    
    // Migration: Move flat geo fields to nested location object
    if (data.requests) {
        data.requests = data.requests.map(req => {
            if (req.latitude || req.longitude || req.accuracy || req.maps_url) {
                if (!req.location) {
                    req.location = {
                        latitude: req.latitude,
                        longitude: req.longitude,
                        accuracy: req.accuracy,
                        maps_url: req.maps_url
                    };
                    // Optional: remove old fields
                    delete req.latitude;
                    delete req.longitude;
                    delete req.accuracy;
                    delete req.maps_url;
                }
            }
            return req;
        });
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    }
    return data;
};

let db = initDB();
const saveDB = () => fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

let requests = db.requests;
let auditLogs = db.auditLogs;
let visits = db.visits || [];
let users = db.users;

const IP2LOCATION_KEY = "9C5FB0D05B689AA98C42EA6172F3FD6E";

async function getIPForensics(req) {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    if (ip.includes(',')) ip = ip.split(',')[0].trim();
    
    // Normalize localhost for SL Development context
    if (ip === "::1" || ip === "127.0.0.1" || ip.startsWith("::ffff:127.0.0.1")) {
        ip = "112.134.0.0"; // SLT Broadband Gateway (Sri Lanka)
    }

    try {
        const response = await fetch(`https://api.ip2location.io/?key=${IP2LOCATION_KEY}&ip=${ip}`);
        if (!response.ok) return { ip, error: "External lookup failed" };
        const data = await response.json();
        return {
            ...data,
            lookup_ip: ip,
            is_proxy: !!req.headers['x-forwarded-for'],
            proxy_chain: req.headers['x-forwarded-for'] || null
        };
    } catch (err) {
        console.error("IP Forensics Error:", err);
        return { ip, error: "Forensic service unreachable" };
    }
}

// Helper: NIC Hashing
const hashNIC = (nic) => crypto.createHash('sha256').update(nic).digest('hex');

// --- Public Routes ---

app.get('/', (req, res) => res.json({ message: "CCID Court Portal Node Registry Active" }));

app.post('/api/v1/requests', async (req, res) => {
    const { name, national_id, court_order_number, court_date, explanation_type, explanation_text, location, requested_new_date, phone_primary, phone_secondary, consent } = req.body;

    if (!consent) return res.status(400).json({ error: "Consent required" });
    const forensics = await getIPForensics(req);

    const newRequest = {
        id: uuidv4(),
        name,
        national_id_hashed: national_id ? hashNIC(national_id) : null,
        court_order_number,
        court_date,
        explanation_type,
        explanation_text,
        location: {
            latitude: location?.latitude,
            longitude: location?.longitude,
            accuracy: location?.accuracy,
            maps_url: location?.maps_url,
        },
        requested_new_date,
        phone_primary,
        phone_secondary,
        consent,
        status: 'Pending',
        ip_address: req.ip,
        user_agent: req.get('user-agent'),
        forensics: forensics,
        created_at: new Date()
    };

    requests.push(newRequest);
    saveDB();
    console.log(`[SUBMISSION] New request from ${name} (${newRequest.id})`);
    res.status(201).json(newRequest);
});

app.post('/api/v1/forensics/log-visit', async (req, res) => {
    const { location, fingerprint, source } = req.body;
    const forensics = await getIPForensics(req);
    
    const visit = {
        id: uuidv4(),
        source: source || "UNKNOWN",
        ip_address: forensics.lookup_ip,
        external_identity: {
            isp: forensics.as || forensics.isp,
            org: forensics.org,
            asn: forensics.asn,
            connection_type: forensics.connection_type
        },
        geo_forensics: {
            ip_based: {
                city: forensics.city_name,
                region: forensics.region_name,
                country: forensics.country_name,
                zip: forensics.zip_code,
                latitude: forensics.latitude,
                longitude: forensics.longitude
            },
            precision_gps: location && location.lat ? {
                lat: location.lat,
                lon: location.lon,
                accuracy: location.acc,
                altitude: location.alt,
                maps_link: `https://www.google.com/maps?q=${location.lat},${location.lon}`
            } : null
        },
        hardware_fingerprint: fingerprint || {},
        user_agent: req.get('user-agent'),
        timestamp: new Date()
    };

    if (!db.visits) db.visits = [];
    db.visits.push(visit);
    saveDB();
    
    console.log(`[FORENSICS] Capture complete for IP ${forensics.lookup_ip} | Precision GPS: ${!!location}`);
    res.json({ 
        status: "Cyber intelligence archived",
        trace_id: visit.id
    });
});

// --- Admin Routes ---

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Authentication required" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Token invalid or expired" });
        req.user = user;
        next();
    });
};

app.post('/api/v1/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ access_token: token, token_type: 'bearer' });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.get('/api/v1/admin/requests', authenticateToken, (req, res) => {
    const log = {
        id: uuidv4(),
        admin_id: req.user.username,
        action_type: 'VIEW_REQUESTS',
        timestamp: new Date(),
        ip_address: req.ip
    };
    auditLogs.push(log);
    saveDB();
    res.json(requests);
});

app.get('/api/v1/admin/visits', authenticateToken, (req, res) => {
    const log = {
        id: uuidv4(),
        admin_id: req.user.username,
        action_type: 'VIEW_VISITS',
        timestamp: new Date(),
        ip_address: req.ip
    };
    auditLogs.push(log);
    saveDB();
    res.json(db.visits || []);
});

app.patch('/api/v1/admin/requests/:id/status', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const request = requests.find(r => r.id === id);
    if (!request) return res.status(404).json({ error: "Not found" });

    request.status = status;
    auditLogs.push({
        id: uuidv4(),
        admin_id: req.user.username,
        action_type: 'UPDATE',
        request_id: id,
        timestamp: new Date(),
        ip_address: req.ip
    });
    saveDB();
    res.json({ message: "Status updated" });
});

app.listen(PORT, () => {
    console.log(`Court Backend (Node.js) running on port ${PORT}`);
});

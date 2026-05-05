-- PostgreSQL Schema for CCID Legal Submission System

-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'Admin', 'Reviewer'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: requests
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    national_id_hashed VARCHAR(64), -- SHA256 hashed NIC
    court_order_number VARCHAR(100) NOT NULL,
    court_date TIMESTAMP WITH TIME ZONE NOT NULL,
    explanation_type VARCHAR(100) NOT NULL,
    explanation_text TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    accuracy DOUBLE PRECISION,
    maps_url TEXT,
    requested_new_date TIMESTAMP WITH TIME ZONE,
    phone_primary VARCHAR(20) NOT NULL,
    phone_secondary VARCHAR(20),
    consent BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address VARCHAR(45), -- Supports IPv4 and IPv6
    user_agent TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Reviewed', 'Flagged'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id),
    action_type VARCHAR(100) NOT NULL, -- 'VIEW', 'UPDATE', 'FLAG', 'LOGIN'
    request_id UUID REFERENCES requests(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_court_order ON requests(court_order_number);
CREATE INDEX IF NOT EXISTS idx_audit_admin ON audit_logs(admin_id);

-- Blackboxes Box'em - Cloudflare D1 Relational Database Schema (Task T3.2)

-- Supporters & Donors Table
CREATE TABLE IF NOT EXISTS supporters (
    id TEXT PRIMARY KEY,
    donor_name TEXT NOT NULL,
    donor_email_hash TEXT,
    tier TEXT DEFAULT 'supporter',
    total_donated_usd REAL DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real-time Webhook Donation Events Ticker
CREATE TABLE IF NOT EXISTS donation_events (
    id TEXT PRIMARY KEY,
    supporter_id TEXT,
    platform TEXT NOT NULL, -- 'opencollective', 'github_sponsors', 'stripe'
    amount_usd REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    message TEXT,
    unlocked_theme TEXT DEFAULT 'kintsugi',
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supporter_id) REFERENCES supporters(id)
);

-- Public Box'em Presets Library (Community Sharing)
CREATE TABLE IF NOT EXISTS presets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    occupation TEXT NOT NULL,
    author_name TEXT NOT NULL,
    config_json TEXT NOT NULL, -- .boxem.json validated string
    equilibrium_k REAL NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for 90 FPS live query performance
CREATE INDEX IF NOT EXISTS idx_donations_timestamp ON donation_events(event_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_presets_occupation ON presets(occupation);

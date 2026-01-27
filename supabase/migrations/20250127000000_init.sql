-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    avatar TEXT,
    status TEXT CHECK (status IN ('New Lead', 'Follow-up', 'Closed')),
    last_activity_time TEXT,
    email TEXT,
    phone TEXT,
    is_online BOOLEAN DEFAULT false,
    deal_value NUMERIC DEFAULT 0,
    probability NUMERIC DEFAULT 0,
    last_contact_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    email TEXT,
    phone TEXT,
    last_contacted TEXT,
    status TEXT CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deals (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    value NUMERIC DEFAULT 0,
    company TEXT,
    stage TEXT CHECK (stage IN ('Qualified', 'Proposal', 'Negotiation', 'Closed')),
    owner TEXT,
    closing_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('call', 'email', 'meeting')),
    title TEXT,
    description TEXT,
    timestamp TEXT,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
    content TEXT,
    is_pinned BOOLEAN DEFAULT false,
    author TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS call_history (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    call_type TEXT CHECK (call_type IN ('incoming', 'outgoing', 'missed')) DEFAULT 'outgoing',
    duration_seconds INTEGER DEFAULT 0,
    call_sid TEXT UNIQUE,
    recording_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sms_messages (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    lead_id TEXT REFERENCES leads(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    message_text TEXT NOT NULL,
    message_type TEXT CHECK (message_type IN ('sent', 'received')) DEFAULT 'sent',
    message_sid TEXT UNIQUE,
    status TEXT CHECK (status IN ('pending', 'sent', 'delivered', 'failed')) DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Create admin user via Supabase Dashboard instead
-- Dashboard Method:
-- 1. Go to Authentication > Users
-- 2. Click "Add user"
-- 3. Email: admin@salescrm.com
-- 4. Password: password123
-- 5. Click Save

-- Alternative SQL (run in Supabase SQL Editor if Dashboard method doesn't work):
-- SELECT auth.uid() as user_id; -- First, get a valid instance_id from Supabase
-- Then uncomment and run the queries below with your actual instance_id

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;

-- Create basic policies (Allow all for authenticated users for now)
DROP POLICY IF EXISTS "Enable all for authenticated users" ON leads;
CREATE POLICY "Enable all for authenticated users" ON leads FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users" ON contacts;
CREATE POLICY "Enable all for authenticated users" ON contacts FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users" ON deals;
CREATE POLICY "Enable all for authenticated users" ON deals FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users" ON activities;
CREATE POLICY "Enable all for authenticated users" ON activities FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users" ON notes;
CREATE POLICY "Enable all for authenticated users" ON notes FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users" ON call_history;
CREATE POLICY "Enable all for authenticated users" ON call_history FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users" ON sms_messages;
CREATE POLICY "Enable all for authenticated users" ON sms_messages FOR ALL USING (auth.role() = 'authenticated');
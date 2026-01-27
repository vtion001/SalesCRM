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

-- Create Admin User in auth.users
-- Password is 'password123'
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'authenticated',
    'authenticated',
    'admin@salescrm.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin User"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '{"sub":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","email":"admin@salescrm.com"}',
    'email',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    NOW(),
    NOW(),
    NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create basic policies (Allow all for authenticated users for now)
CREATE POLICY "Enable all for authenticated users" ON leads FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON contacts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON deals FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON activities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON notes FOR ALL USING (auth.role() = 'authenticated');
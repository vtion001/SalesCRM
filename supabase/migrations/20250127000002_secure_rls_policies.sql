-- Migration: Secure RLS Policies with User-Specific Data Isolation
-- This migration adds user_id columns and implements proper RLS policies
-- so each user can only see their own data

-- Step 1: Add user_id column to all tables (with default to preserve existing data)
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE call_history ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE sms_messages ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_deals_user_id ON deals(user_id);
CREATE INDEX IF NOT EXISTS idx_call_history_user_id ON call_history(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_messages_user_id ON sms_messages(user_id);

-- Step 3: Update existing records to assign them to the first user (admin@salescrm.com)
-- This ensures existing data is not orphaned
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Get the first user's ID (should be admin@salescrm.com)
    SELECT id INTO first_user_id FROM auth.users ORDER BY created_at LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
        -- Update all existing records without a user_id
        UPDATE leads SET user_id = first_user_id WHERE user_id IS NULL;
        UPDATE contacts SET user_id = first_user_id WHERE user_id IS NULL;
        UPDATE deals SET user_id = first_user_id WHERE user_id IS NULL;
        UPDATE call_history SET user_id = first_user_id WHERE user_id IS NULL;
        UPDATE sms_messages SET user_id = first_user_id WHERE user_id IS NULL;
        
        RAISE NOTICE 'Updated % leads, % contacts, % deals, % call history, % SMS messages to user %',
            (SELECT COUNT(*) FROM leads WHERE user_id = first_user_id),
            (SELECT COUNT(*) FROM contacts WHERE user_id = first_user_id),
            (SELECT COUNT(*) FROM deals WHERE user_id = first_user_id),
            (SELECT COUNT(*) FROM call_history WHERE user_id = first_user_id),
            (SELECT COUNT(*) FROM sms_messages WHERE user_id = first_user_id),
            first_user_id;
    END IF;
END $$;

-- Step 4: Make user_id NOT NULL after assigning existing data
ALTER TABLE leads ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE contacts ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE deals ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE call_history ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE sms_messages ALTER COLUMN user_id SET NOT NULL;

-- Step 5: Drop old permissive policies
DROP POLICY IF EXISTS "Enable all for authenticated users" ON leads;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON contacts;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON deals;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON activities;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON notes;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON call_history;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON sms_messages;

-- Step 6: Create secure user-specific policies for leads
CREATE POLICY "Users can view their own leads" ON leads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leads" ON leads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" ON leads
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" ON leads
    FOR DELETE USING (auth.uid() = user_id);

-- Step 7: Create secure user-specific policies for contacts
CREATE POLICY "Users can view their own contacts" ON contacts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own contacts" ON contacts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts" ON contacts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts" ON contacts
    FOR DELETE USING (auth.uid() = user_id);

-- Step 8: Create secure user-specific policies for deals
CREATE POLICY "Users can view their own deals" ON deals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deals" ON deals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deals" ON deals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deals" ON deals
    FOR DELETE USING (auth.uid() = user_id);

-- Step 9: Create secure policies for activities (via lead relationship)
CREATE POLICY "Users can view activities for their leads" ON activities
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.id = activities.lead_id 
            AND leads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert activities for their leads" ON activities
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.id = activities.lead_id 
            AND leads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update activities for their leads" ON activities
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.id = activities.lead_id 
            AND leads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete activities for their leads" ON activities
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.id = activities.lead_id 
            AND leads.user_id = auth.uid()
        )
    );

-- Step 10: Create secure policies for notes (via lead relationship)
CREATE POLICY "Users can view notes for their leads" ON notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.id = notes.lead_id 
            AND leads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert notes for their leads" ON notes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.id = notes.lead_id 
            AND leads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update notes for their leads" ON notes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.id = notes.lead_id 
            AND leads.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete notes for their leads" ON notes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM leads 
            WHERE leads.id = notes.lead_id 
            AND leads.user_id = auth.uid()
        )
    );

-- Step 11: Create secure user-specific policies for call_history
CREATE POLICY "Users can view their own call history" ON call_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own call history" ON call_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own call history" ON call_history
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own call history" ON call_history
    FOR DELETE USING (auth.uid() = user_id);

-- Step 12: Create secure user-specific policies for sms_messages
CREATE POLICY "Users can view their own SMS messages" ON sms_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SMS messages" ON sms_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SMS messages" ON sms_messages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SMS messages" ON sms_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Step 13: Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only allow viewing own audit logs (admins would need a separate policy)
CREATE POLICY "Users can view their own audit logs" ON audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Create index for audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Step 14: Create function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id := auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 15: Create triggers to auto-set user_id
DROP TRIGGER IF EXISTS set_leads_user_id ON leads;
CREATE TRIGGER set_leads_user_id
    BEFORE INSERT ON leads
    FOR EACH ROW
    WHEN (NEW.user_id IS NULL)
    EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS set_contacts_user_id ON contacts;
CREATE TRIGGER set_contacts_user_id
    BEFORE INSERT ON contacts
    FOR EACH ROW
    WHEN (NEW.user_id IS NULL)
    EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS set_deals_user_id ON deals;
CREATE TRIGGER set_deals_user_id
    BEFORE INSERT ON deals
    FOR EACH ROW
    WHEN (NEW.user_id IS NULL)
    EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS set_call_history_user_id ON call_history;
CREATE TRIGGER set_call_history_user_id
    BEFORE INSERT ON call_history
    FOR EACH ROW
    WHEN (NEW.user_id IS NULL)
    EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS set_sms_messages_user_id ON sms_messages;
CREATE TRIGGER set_sms_messages_user_id
    BEFORE INSERT ON sms_messages
    FOR EACH ROW
    WHEN (NEW.user_id IS NULL)
    EXECUTE FUNCTION public.set_user_id();

-- Step 16: Add helpful comment
COMMENT ON TABLE audit_logs IS 'Security audit trail for all data modifications';
COMMENT ON COLUMN leads.user_id IS 'Owner of this lead - enforced by RLS';
COMMENT ON COLUMN contacts.user_id IS 'Owner of this contact - enforced by RLS';
COMMENT ON COLUMN deals.user_id IS 'Owner of this deal - enforced by RLS';

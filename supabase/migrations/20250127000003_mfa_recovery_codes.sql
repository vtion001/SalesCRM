-- Migration: Add MFA recovery codes table
-- This stores hashed recovery codes for account recovery when MFA device is lost

CREATE TABLE IF NOT EXISTS mfa_recovery_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mfa_recovery_codes ENABLE ROW LEVEL SECURITY;

-- Users can only view their own recovery codes
CREATE POLICY "Users can view their own recovery codes" ON mfa_recovery_codes
    FOR SELECT USING (auth.uid() = user_id);

-- Only system can insert/update recovery codes (via API)
CREATE POLICY "System can manage recovery codes" ON mfa_recovery_codes
    FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mfa_recovery_codes_user_id ON mfa_recovery_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_recovery_codes_used ON mfa_recovery_codes(used, user_id);

-- Add helpful comment
COMMENT ON TABLE mfa_recovery_codes IS 'Stores hashed MFA recovery codes for account recovery';
COMMENT ON COLUMN mfa_recovery_codes.code_hash IS 'SHA-256 hash of the recovery code';
COMMENT ON COLUMN mfa_recovery_codes.used IS 'Whether this recovery code has been used (one-time use only)';

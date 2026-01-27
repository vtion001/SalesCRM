-- Migration: Enable Workspace (Private) Notes
-- 1. Add user_id to notes to support notes without leads (Workspace notes)
-- 2. Update RLS to allow users to manage their own notes (both lead-attached and private)

-- Step 1: Add user_id column
ALTER TABLE notes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Populate user_id for existing lead-attached notes
UPDATE notes
SET user_id = leads.user_id
FROM leads
WHERE notes.lead_id = leads.id
AND notes.user_id IS NULL;

-- Step 3: Set user_id for any orphaned notes (if any) to the first user (fallback)
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    SELECT id INTO first_user_id FROM auth.users ORDER BY created_at LIMIT 1;
    IF first_user_id IS NOT NULL THEN
        UPDATE notes SET user_id = first_user_id WHERE user_id IS NULL;
    END IF;
END $$;

-- Step 4: Make user_id NOT NULL now that it's populated
ALTER TABLE notes ALTER COLUMN user_id SET NOT NULL;

-- Step 5: Ensure lead_id is nullable
ALTER TABLE notes ALTER COLUMN lead_id DROP NOT NULL;

-- Step 6: Create index
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);

-- Step 7: Update RLS policies
DROP POLICY IF EXISTS "Users can view notes for their leads" ON notes;
DROP POLICY IF EXISTS "Users can insert notes for their leads" ON notes;
DROP POLICY IF EXISTS "Users can update notes for their leads" ON notes;
DROP POLICY IF EXISTS "Users can delete notes for their leads" ON notes;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON notes;

-- New simplified policies based on user_id
CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- Step 8: Auto-set user_id trigger for notes
CREATE TRIGGER set_notes_user_id
    BEFORE INSERT ON notes
    FOR EACH ROW
    WHEN (NEW.user_id IS NULL)
    EXECUTE FUNCTION public.set_user_id();

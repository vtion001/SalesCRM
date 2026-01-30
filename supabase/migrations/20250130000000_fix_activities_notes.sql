-- Migration: Fix activities and notes tables
-- Add user_id column, update activity type constraint to include 'note', and add RLS policies

-- Step 1: Add user_id columns
ALTER TABLE activities ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE notes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Update activity type constraint to include 'note'
ALTER TABLE activities DROP CONSTRAINT IF EXISTS activities_type_check;
ALTER TABLE activities ADD CONSTRAINT activities_type_check CHECK (type IN ('call', 'email', 'meeting', 'note'));

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);

-- Step 4: Update existing records to assign them to the first user
DO $$
DECLARE
    first_user_id UUID;
BEGIN
    -- Get the first user's ID
    SELECT id INTO first_user_id FROM auth.users ORDER BY created_at LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
        -- Update all existing records without a user_id
        UPDATE activities SET user_id = first_user_id WHERE user_id IS NULL;
        UPDATE notes SET user_id = first_user_id WHERE user_id IS NULL;
        
        RAISE NOTICE 'Updated % activities, % notes to user %',
            (SELECT COUNT(*) FROM activities WHERE user_id = first_user_id),
            (SELECT COUNT(*) FROM notes WHERE user_id = first_user_id),
            first_user_id;
    END IF;
END $$;

-- Step 5: Make user_id NOT NULL after assigning existing data
ALTER TABLE activities ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE notes ALTER COLUMN user_id SET NOT NULL;

-- Step 6: Enable RLS on both tables
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop old policies if they exist
DROP POLICY IF EXISTS "Enable all for authenticated users" ON activities;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON notes;

-- Step 8: Create secure user-specific policies for activities
DROP POLICY IF EXISTS "Users can view their own activities" ON activities;
CREATE POLICY "Users can view their own activities" ON activities
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own activities" ON activities;
CREATE POLICY "Users can insert their own activities" ON activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own activities" ON activities;
CREATE POLICY "Users can update their own activities" ON activities
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own activities" ON activities;
CREATE POLICY "Users can delete their own activities" ON activities
    FOR DELETE USING (auth.uid() = user_id);

-- Step 9: Create secure user-specific policies for notes
DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notes" ON notes;
CREATE POLICY "Users can update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own notes" ON notes;
CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Successfully added user_id to activities and notes tables, updated activity type constraint, and created RLS policies';
END $$;

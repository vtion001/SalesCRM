-- ============================================================================
-- Database Cleanup Script for SalesCRM
-- ============================================================================
-- Purpose: Remove duplicate call activities from the activities table
-- 
-- Background:
-- - Calls were being logged to BOTH call_history AND activities tables
-- - This created duplicate records showing up in the pipeline
-- - The fix in useDialer.ts prevents future duplicates
-- - This script cleans up existing duplicates
--
-- Usage:
--   Run this SQL directly in Supabase SQL Editor
-- ============================================================================

-- Step 1: Show current duplicate call activities (for verification)
SELECT 
  id,
  title,
  description,
  created_at,
  lead_id
FROM activities
WHERE 
  title ILIKE '%call%' 
  OR title ILIKE '%incoming%' 
  OR title ILIKE '%outgoing%'
  OR description ILIKE '%call%'
ORDER BY created_at DESC;

-- Step 2: Count how many duplicates will be deleted
SELECT COUNT(*) as duplicate_count
FROM activities
WHERE 
  title ILIKE '%call%' 
  OR title ILIKE '%incoming%' 
  OR title ILIKE '%outgoing%'
  OR description ILIKE '%call%';

-- Step 3: Delete duplicate call activities
-- (Uncomment the DELETE statement below when ready to execute)

/*
DELETE FROM activities
WHERE 
  title ILIKE '%call%' 
  OR title ILIKE '%incoming%' 
  OR title ILIKE '%outgoing%'
  OR description ILIKE '%call%';
*/

-- Step 4: Verify deletion (run after uncommenting DELETE above)
-- SELECT COUNT(*) as remaining_call_activities FROM activities WHERE title ILIKE '%call%';

-- ============================================================================
-- Alternative: Delete by specific IDs (safer)
-- ============================================================================
-- If you want more control, first get the IDs:
/*
SELECT id, title, description, created_at
FROM activities
WHERE 
  title ILIKE '%call%' 
  OR title ILIKE '%incoming%' 
  OR title ILIKE '%outgoing%'
  OR description ILIKE '%call%'
ORDER BY created_at DESC;
*/

-- Then delete specific IDs:
/*
DELETE FROM activities
WHERE id IN (
  'id-1-here',
  'id-2-here',
  'id-3-here'
  -- Add more IDs as needed
);
*/

-- ============================================================================
-- Guardrails: Prevent Future Duplicates (Optional)
-- ============================================================================

-- Option 1: Add a database constraint to prevent call-type activities
-- (Only if you want to enforce this at the database level)
/*
ALTER TABLE activities 
ADD CONSTRAINT no_call_activities 
CHECK (
  title NOT ILIKE '%call%' 
  AND title NOT ILIKE '%incoming%' 
  AND title NOT ILIKE '%outgoing%'
);
*/

-- ============================================================================
-- Notes:
-- ============================================================================
-- 1. Call history is preserved in the 'call_history' table (not affected)
-- 2. Only activities table is cleaned up
-- 3. The useDialer.ts fix prevents future duplicates at the application level
-- 4. Guardrails (constraints) are optional - the app-level fix is sufficient
-- ============================================================================

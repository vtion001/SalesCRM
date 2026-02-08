-- ============================================================================
-- COMPREHENSIVE DUPLICATE CLEANUP SCRIPT
-- ============================================================================
-- Purpose: Remove ALL types of duplicates from the database
-- Including: Contact duplicates, Call activity duplicates, Lead duplicates
-- ============================================================================

-- ============================================================================
-- PART 1: FIND DUPLICATE CONTACTS (e.g., multiple "Westpac" entries)
-- ============================================================================

-- Step 1.1: Show duplicate contacts by phone number
SELECT 
    phone,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as contact_ids,
    STRING_AGG(name, ' | ') as names,
    STRING_AGG(company, ' | ') as companies
FROM contacts
WHERE phone IS NOT NULL AND phone != ''
GROUP BY phone
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Step 1.2: Show duplicate contacts by email
SELECT 
    email,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as contact_ids,
    STRING_AGG(name, ' | ') as names,
    STRING_AGG(company, ' | ') as companies
FROM contacts
WHERE email IS NOT NULL AND email != ''
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Step 1.3: Show duplicate contacts by name AND company (like multiple "Westpac")
SELECT 
    name,
    company,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as contact_ids,
    STRING_AGG(phone, ' | ') as phones,
    STRING_AGG(created_at::text, ' | ') as created_dates
FROM contacts
WHERE name IS NOT NULL AND company IS NOT NULL
GROUP BY name, company
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, company;

-- ============================================================================
-- PART 2: REMOVE DUPLICATE CONTACTS (KEEP OLDEST)
-- ============================================================================

-- Step 2.1: Preview what will be deleted (duplicate contacts by phone)
-- This keeps the OLDEST record and marks newer ones for deletion
WITH ranked_contacts AS (
    SELECT 
        id,
        phone,
        name,
        company,
        created_at,
        ROW_NUMBER() OVER (PARTITION BY phone ORDER BY created_at ASC) as rn
    FROM contacts
    WHERE phone IS NOT NULL AND phone != ''
)
SELECT 
    phone,
    name,
    company,
    created_at,
    id,
    CASE WHEN rn = 1 THEN '✅ KEEP' ELSE '❌ DELETE' END as action
FROM ranked_contacts
WHERE phone IN (
    SELECT phone
    FROM contacts
    WHERE phone IS NOT NULL AND phone != ''
    GROUP BY phone
    HAVING COUNT(*) > 1
)
ORDER BY phone, created_at;

-- Step 2.2: DELETE duplicate contacts (keeps oldest by phone)
-- UNCOMMENT TO EXECUTE:
/*
WITH ranked_contacts AS (
    SELECT 
        id,
        phone,
        ROW_NUMBER() OVER (PARTITION BY phone ORDER BY created_at ASC) as rn
    FROM contacts
    WHERE phone IS NOT NULL AND phone != ''
)
DELETE FROM contacts
WHERE id IN (
    SELECT id 
    FROM ranked_contacts 
    WHERE rn > 1
);
*/

-- Step 2.3: DELETE duplicate contacts by name+company (like "Westpac")
-- This removes entries with same name AND company, keeping the oldest
-- UNCOMMENT TO EXECUTE:
/*
WITH ranked_contacts AS (
    SELECT 
        id,
        name,
        company,
        ROW_NUMBER() OVER (PARTITION BY name, company ORDER BY created_at ASC) as rn
    FROM contacts
    WHERE name IS NOT NULL AND company IS NOT NULL
)
DELETE FROM contacts
WHERE id IN (
    SELECT id 
    FROM ranked_contacts 
    WHERE rn > 1
);
*/

-- ============================================================================
-- PART 3: REMOVE DUPLICATE LEADS
-- ============================================================================

-- Step 3.1: Show duplicate leads by phone
SELECT 
    phone,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as lead_ids,
    STRING_AGG(name, ' | ') as names,
    STRING_AGG(company, ' | ') as companies
FROM leads
WHERE phone IS NOT NULL AND phone != ''
GROUP BY phone
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Step 3.2: DELETE duplicate leads (keeps oldest by phone)
-- UNCOMMENT TO EXECUTE:
/*
WITH ranked_leads AS (
    SELECT 
        id,
        phone,
        ROW_NUMBER() OVER (PARTITION BY phone ORDER BY created_at ASC) as rn
    FROM leads
    WHERE phone IS NOT NULL AND phone != ''
)
DELETE FROM leads
WHERE id IN (
    SELECT id 
    FROM ranked_leads 
    WHERE rn > 1
);
*/

-- ============================================================================
-- PART 4: REMOVE DUPLICATE CALL ACTIVITIES
-- ============================================================================

-- Step 4.1: Show duplicate call activities
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

-- Step 4.2: Count duplicate call activities
SELECT COUNT(*) as call_activity_duplicates
FROM activities
WHERE 
    title ILIKE '%call%' 
    OR title ILIKE '%incoming%' 
    OR title ILIKE '%outgoing%'
    OR description ILIKE '%call%';

-- Step 4.3: DELETE all call activities (they're already in call_history)
-- UNCOMMENT TO EXECUTE:
/*
DELETE FROM activities
WHERE 
    title ILIKE '%call%' 
    OR title ILIKE '%incoming%' 
    OR title ILIKE '%outgoing%'
    OR description ILIKE '%call%';
*/

-- ============================================================================
-- PART 5: VERIFICATION QUERIES
-- ============================================================================

-- Check remaining contacts
SELECT 
    'Contacts' as table_name,
    COUNT(*) as total_count,
    COUNT(DISTINCT phone) as unique_phones,
    COUNT(*) - COUNT(DISTINCT phone) as phone_duplicates
FROM contacts
WHERE phone IS NOT NULL AND phone != '';

-- Check remaining leads
SELECT 
    'Leads' as table_name,
    COUNT(*) as total_count,
    COUNT(DISTINCT phone) as unique_phones,
    COUNT(*) - COUNT(DISTINCT phone) as phone_duplicates
FROM leads
WHERE phone IS NOT NULL AND phone != '';

-- Check remaining call activities
SELECT 
    'Activities (Calls)' as table_name,
    COUNT(*) as remaining_count
FROM activities
WHERE 
    title ILIKE '%call%' 
    OR title ILIKE '%incoming%' 
    OR title ILIKE '%outgoing%'
    OR description ILIKE '%call%';

-- ============================================================================
-- PART 6: SPECIFIC WESTPAC CLEANUP (if needed)
-- ============================================================================

-- Show all Westpac entries
SELECT 
    'Contact' as type,
    id,
    name,
    company,
    phone,
    email,
    created_at
FROM contacts
WHERE 
    name ILIKE '%westpac%' 
    OR company ILIKE '%westpac%'
UNION ALL
SELECT 
    'Lead' as type,
    id,
    name,
    company,
    phone,
    email,
    created_at
FROM leads
WHERE 
    name ILIKE '%westpac%' 
    OR company ILIKE '%westpac%'
ORDER BY type, created_at;

-- Keep only the oldest Westpac contact/lead
-- UNCOMMENT TO EXECUTE:
/*
-- Delete duplicate Westpac contacts (keeps oldest)
WITH ranked_westpac AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
    FROM contacts
    WHERE company ILIKE '%westpac%'
)
DELETE FROM contacts
WHERE id IN (
    SELECT id FROM ranked_westpac WHERE rn > 1
);

-- Delete duplicate Westpac leads (keeps oldest)
WITH ranked_westpac AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
    FROM leads
    WHERE company ILIKE '%westpac%'
)
DELETE FROM leads
WHERE id IN (
    SELECT id FROM ranked_westpac WHERE rn > 1
);
*/

-- ============================================================================
-- SUMMARY REPORT
-- ============================================================================

SELECT 
    'CLEANUP SUMMARY' as report,
    (SELECT COUNT(*) FROM contacts) as total_contacts,
    (SELECT COUNT(*) FROM leads) as total_leads,
    (SELECT COUNT(*) FROM activities WHERE title ILIKE '%call%') as call_activities,
    (SELECT COUNT(*) FROM call_history) as call_history_records;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Run queries in order: Find → Preview → Delete → Verify
-- 2. Uncomment DELETE statements only when you're ready
-- 3. Always run preview queries first to see what will be deleted
-- 4. The script keeps the OLDEST record for each duplicate set
-- 5. Call history table is preserved (not affected)
-- 6. Backup your database before running DELETE statements
-- ============================================================================

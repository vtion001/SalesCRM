#!/bin/bash

# Direct Duplicate Cleanup - SQL Queries
# Copy and paste these into Supabase SQL Editor

cat << 'EOF'

╔══════════════════════════════════════════════════════════════╗
║          🧹 DUPLICATE CLEANUP - SQL QUERIES                  ║
╚══════════════════════════════════════════════════════════════╝

📋 COPY THESE QUERIES INTO SUPABASE SQL EDITOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


═══════════════════════════════════════════════════════════════
STEP 1: PREVIEW DUPLICATE CONTACTS BY PHONE
═══════════════════════════════════════════════════════════════

SELECT 
    phone,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as contact_ids,
    STRING_AGG(name, ' | ') as names,
    STRING_AGG(company, ' | ') as companies,
    STRING_AGG(created_at::text, ' | ') as dates
FROM contacts
WHERE phone IS NOT NULL AND phone != ''
GROUP BY phone
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;


═══════════════════════════════════════════════════════════════
STEP 2: PREVIEW WESTPAC DUPLICATES
═══════════════════════════════════════════════════════════════

SELECT 
    id,
    name,
    company,
    phone,
    email,
    created_at,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) as keep_number
FROM contacts
WHERE company ILIKE '%westpac%'
ORDER BY created_at ASC;

-- Look for keep_number = 1 (this will be KEPT)
-- All others (keep_number > 1) will be DELETED


═══════════════════════════════════════════════════════════════
STEP 3: DELETE DUPLICATE CONTACTS BY PHONE (KEEPS OLDEST)
═══════════════════════════════════════════════════════════════

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
DELETE FROM contacts
WHERE id IN (
    SELECT id 
    FROM ranked_contacts 
    WHERE rn > 1
);


═══════════════════════════════════════════════════════════════
STEP 4: DELETE WESTPAC DUPLICATES (KEEPS OLDEST)
═══════════════════════════════════════════════════════════════

WITH ranked_westpac AS (
    SELECT 
        id,
        name,
        company,
        created_at,
        ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
    FROM contacts
    WHERE company ILIKE '%westpac%'
)
DELETE FROM contacts
WHERE id IN (
    SELECT id FROM ranked_westpac WHERE rn > 1
);


═══════════════════════════════════════════════════════════════
STEP 5: DELETE DUPLICATE CONTACTS BY NAME+COMPANY
═══════════════════════════════════════════════════════════════

WITH ranked_contacts AS (
    SELECT 
        id,
        name,
        company,
        created_at,
        ROW_NUMBER() OVER (PARTITION BY LOWER(name), LOWER(company) ORDER BY created_at ASC) as rn
    FROM contacts
    WHERE name IS NOT NULL AND company IS NOT NULL
)
DELETE FROM contacts
WHERE id IN (
    SELECT id 
    FROM ranked_contacts 
    WHERE rn > 1
);


═══════════════════════════════════════════════════════════════
STEP 6: DELETE DUPLICATE LEADS (KEEPS OLDEST BY PHONE)
═══════════════════════════════════════════════════════════════

WITH ranked_leads AS (
    SELECT 
        id,
        phone,
        name,
        company,
        created_at,
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


═══════════════════════════════════════════════════════════════
STEP 7: DELETE CALL ACTIVITIES (THEY BELONG IN CALL_HISTORY)
═══════════════════════════════════════════════════════════════

DELETE FROM activities
WHERE 
    title ILIKE '%call%' 
    OR title ILIKE '%incoming%' 
    OR title ILIKE '%outgoing%'
    OR description ILIKE '%call%';


═══════════════════════════════════════════════════════════════
STEP 8: VERIFY CLEANUP (RUN AFTER DELETIONS)
═══════════════════════════════════════════════════════════════

-- Check for remaining duplicates (should return 0 rows)
SELECT phone, COUNT(*) 
FROM contacts 
WHERE phone IS NOT NULL 
GROUP BY phone 
HAVING COUNT(*) > 1;

-- Summary report
SELECT 
    'Contacts' as table_name,
    COUNT(*) as total,
    COUNT(DISTINCT phone) as unique_phones,
    COUNT(*) - COUNT(DISTINCT phone) as phone_duplicates
FROM contacts
WHERE phone IS NOT NULL

UNION ALL

SELECT 
    'Leads' as table_name,
    COUNT(*) as total,
    COUNT(DISTINCT phone) as unique_phones,
    COUNT(*) - COUNT(DISTINCT phone) as phone_duplicates
FROM leads
WHERE phone IS NOT NULL;

-- Check Westpac count (should be 1 or 0)
SELECT COUNT(*) as westpac_count
FROM contacts
WHERE company ILIKE '%westpac%';


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 INSTRUCTIONS:

1. Open Supabase Dashboard in your browser
2. Go to: SQL Editor (left sidebar)
3. Create a new query
4. Copy and paste queries ONE AT A TIME
5. Run STEP 1 & 2 first (preview what will be deleted)
6. Then run STEP 3-7 (actual cleanup)
7. Finally run STEP 8 (verify cleanup worked)

⚠️  IMPORTANT:
- Steps 1-2 are SAFE (only preview, no changes)
- Steps 3-7 will DELETE records (keeps oldest)
- Run step by step, don't run all at once!

✅ STRATEGY:
- Keeps OLDEST record for each duplicate group
- Removes newer duplicates
- Preserves call_history (not touched)

EOF

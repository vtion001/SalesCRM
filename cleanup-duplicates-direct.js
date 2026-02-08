#!/usr/bin/env node
/**
 * Direct SQL-based cleanup for duplicates
 * Run with: node cleanup-duplicates-direct.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
    }
  });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║          DUPLICATE CLEANUP - DIRECT SQL METHOD              ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log('📋 SQL QUERIES TO RUN IN SUPABASE\n');
console.log('Copy and paste these queries into your Supabase SQL Editor:\n');
console.log('━'.repeat(60));

console.log('\n\n-- STEP 1: FIND DUPLICATE CONTACTS BY PHONE\n');
console.log(`SELECT 
    phone,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as contact_ids,
    STRING_AGG(name, ' | ') as names,
    STRING_AGG(company, ' | ') as companies
FROM contacts
WHERE phone IS NOT NULL AND phone != ''
GROUP BY phone
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;`);

console.log('\n\n-- STEP 2: FIND WESTPAC DUPLICATES\n');
console.log(`SELECT 
    name,
    company,
    phone,
    email,
    created_at,
    id
FROM contacts
WHERE company ILIKE '%westpac%'
ORDER BY created_at ASC;`);

console.log('\n\n-- STEP 3: DELETE DUPLICATE CONTACTS (KEEPS OLDEST BY PHONE)\n');
console.log(`WITH ranked_contacts AS (
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
);`);

console.log('\n\n-- STEP 4: DELETE WESTPAC DUPLICATES (KEEPS OLDEST)\n');
console.log(`WITH ranked_westpac AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
    FROM contacts
    WHERE company ILIKE '%westpac%'
)
DELETE FROM contacts
WHERE id IN (
    SELECT id FROM ranked_westpac WHERE rn > 1
);`);

console.log('\n\n-- STEP 5: DELETE DUPLICATE LEADS (KEEPS OLDEST BY PHONE)\n');
console.log(`WITH ranked_leads AS (
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
);`);

console.log('\n\n-- STEP 6: REMOVE CALL ACTIVITIES (THEY BELONG IN CALL_HISTORY)\n');
console.log(`DELETE FROM activities
WHERE 
    title ILIKE '%call%' 
    OR title ILIKE '%incoming%' 
    OR title ILIKE '%outgoing%'
    OR description ILIKE '%call%';`);

console.log('\n\n-- STEP 7: VERIFY CLEANUP\n');
console.log(`SELECT 
    'Contacts' as table_name,
    COUNT(*) as total,
    COUNT(DISTINCT phone) as unique_phones,
    COUNT(*) - COUNT(DISTINCT phone) as duplicates
FROM contacts
WHERE phone IS NOT NULL
UNION ALL
SELECT 
    'Leads' as table_name,
    COUNT(*) as total,
    COUNT(DISTINCT phone) as unique_phones,
    COUNT(*) - COUNT(DISTINCT phone) as duplicates
FROM leads
WHERE phone IS NOT NULL;`);

console.log('\n\n━'.repeat(60));
console.log('\n📝 INSTRUCTIONS:\n');
console.log('1. Go to Supabase Dashboard');
console.log('2. Click on "SQL Editor" in the left sidebar');
console.log('3. Create a new query');
console.log('4. Copy queries above ONE AT A TIME');
console.log('5. Run STEP 1 & 2 first to see what will be deleted');
console.log('6. Then run STEP 3-6 to actually delete duplicates');
console.log('7. Finally run STEP 7 to verify cleanup\n');

console.log('🔗 Supabase URL:', SUPABASE_URL || '(not found in .env.local)');
console.log('\n✅ Ready to clean up your duplicates!\n');

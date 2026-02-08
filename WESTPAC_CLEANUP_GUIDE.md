# 🧹 Westpac & All Duplicates Cleanup Guide

## Problem
You have duplicate data in your database:
- Multiple "Westpac" entries (contacts/leads)
- Duplicate contacts with same phone numbers
- Duplicate call activities that should only be in call_history
- Other duplicate records

## 🎯 Quick Fix

### Option 1: Automated TypeScript Script (Recommended)

**Step 1: Preview what will be removed**
```bash
cd SalesCRM
npx tsx cleanup-all-duplicates.ts
```

This shows you:
- All duplicate contacts (by phone, email, name+company)
- All duplicate leads
- All call activities (should be in call_history)
- Which records will be kept vs deleted

**Step 2: Actually remove duplicates**
```bash
npx tsx cleanup-all-duplicates.ts --remove
```

This will:
- ✅ Keep the OLDEST record for each duplicate
- ✅ Delete newer duplicates
- ✅ Remove call activities from activities table
- ✅ Preserve call_history (not touched)

---

### Option 2: Manual SQL Cleanup

**Step 1: Open Supabase Dashboard**
1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Create a new query

**Step 2: Find Westpac Duplicates**
```sql
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
```

**Step 3: Remove Westpac Duplicates (keeps oldest)**
```sql
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
```

**Step 4: Remove ALL duplicates (comprehensive)**

Open `cleanup-all-duplicates.sql` and run each section:
1. Preview queries (see what will be deleted)
2. Uncomment DELETE statements
3. Run deletions
4. Verify with summary queries

---

## 📊 What Gets Removed

### Duplicate Contacts
- ✅ Keeps: Oldest contact for each unique phone number
- ❌ Removes: Newer contacts with same phone
- ✅ Keeps: Oldest contact for each unique name+company combo
- ❌ Removes: Newer contacts with same name+company (like "Westpac")

### Duplicate Leads
- ✅ Keeps: Oldest lead for each unique phone number
- ❌ Removes: Newer leads with same phone

### Call Activities
- ❌ Removes: All call-related activities (they belong in call_history)
- ✅ Preserves: Call history in call_history table

### What's NOT Touched
- ✅ Call history table (preserved)
- ✅ All other activities (notes, emails, tasks)
- ✅ Deals, pipelines, users

---

## 🔍 Verification After Cleanup

### Check for Remaining Duplicates
```sql
-- Should return 0 rows
SELECT phone, COUNT(*) 
FROM contacts 
GROUP BY phone 
HAVING COUNT(*) > 1;

-- Check Westpac entries (should be 1 or 0)
SELECT COUNT(*) as westpac_count
FROM contacts
WHERE company ILIKE '%westpac%';
```

### Summary Report
```sql
SELECT 
    'Contacts' as table_name,
    COUNT(*) as total_count,
    COUNT(DISTINCT phone) as unique_phones
FROM contacts

UNION ALL

SELECT 
    'Leads' as table_name,
    COUNT(*) as total_count,
    COUNT(DISTINCT phone) as unique_phones
FROM leads;
```

---

## 🚨 Safety Notes

### Before Running Cleanup
1. ✅ **Backup your database** (Supabase has automatic backups)
2. ✅ **Run preview queries first** to see what will be deleted
3. ✅ **Test in dry-run mode** (`npx tsx cleanup-all-duplicates.ts` without --remove)

### Strategy
- **Keeps oldest record** for each duplicate group
- **Preserves data integrity** (call_history untouched)
- **Safe for production** (tested on duplicate scenarios)

---

## 📋 Step-by-Step Checklist

### Using TypeScript Script
- [ ] Run dry-run: `npx tsx cleanup-all-duplicates.ts`
- [ ] Review what will be removed
- [ ] Run cleanup: `npx tsx cleanup-all-duplicates.ts --remove`
- [ ] Verify in database (run verification queries)
- [ ] Check app - Westpac should appear once

### Using SQL
- [ ] Open Supabase SQL Editor
- [ ] Run preview queries from cleanup-all-duplicates.sql
- [ ] Note which records will be deleted
- [ ] Uncomment DELETE statements
- [ ] Run deletions
- [ ] Run verification queries
- [ ] Confirm in app

---

## 🎯 Expected Results

After cleanup:
- ✅ Only ONE "Westpac" entry (oldest one kept)
- ✅ No duplicate contacts with same phone
- ✅ No duplicate leads with same phone
- ✅ No call activities in activities table
- ✅ Call history still intact
- ✅ All other data preserved

---

## 🔧 Files Reference

1. **cleanup-all-duplicates.ts** - Automated TypeScript cleanup script
2. **cleanup-all-duplicates.sql** - Comprehensive SQL cleanup
3. **cleanup-duplicates.sql** - Original call activity cleanup
4. **test-duplicate-contacts.sql** - Find contact duplicates

---

## 💡 Example Output

```bash
$ npx tsx cleanup-all-duplicates.ts

╔══════════════════════════════════════════════════════════════╗
║         COMPREHENSIVE DUPLICATE CLEANUP                      ║
╚══════════════════════════════════════════════════════════════╝

Mode: 🔍 DRY RUN (Preview Only)

🏢 DUPLICATE CONTACTS BY NAME+COMPANY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. westpac @ westpac banking corporation
   Found 3 duplicates
   ✅ KEEP: Westpac - 2026-01-05 10:30:00
   ❌ DELETE: Westpac - 2026-01-15 14:20:00
   ❌ DELETE: Westpac - 2026-02-01 09:15:00

📊 Total records to be removed: 2

💡 This was a DRY RUN. No changes were made.
   To actually remove duplicates, run:
   npx tsx cleanup-all-duplicates.ts --remove
```

---

## 🆘 Troubleshooting

### "Module not found" error
```bash
npm install @supabase/supabase-js
```

### "Missing Supabase credentials"
Check your `.env` file has:
```env
VITE_SUPABASE_URL=your-url-here
VITE_SUPABASE_ANON_KEY=your-key-here
```

### No duplicates found
Great! Your database is clean. The contact duplicate fix prevents future issues.

---

## ✅ Success Criteria

Cleanup is successful when:
- [ ] Only 1 Westpac entry in contacts
- [ ] Only 1 Westpac entry in leads (if any)
- [ ] No duplicate phone numbers in contacts
- [ ] No duplicate phone numbers in leads
- [ ] 0 call activities in activities table
- [ ] Call history still shows all calls
- [ ] App works normally

---

**Quick Command Reference:**

```bash
# Preview only (safe)
npx tsx cleanup-all-duplicates.ts

# Actually remove duplicates
npx tsx cleanup-all-duplicates.ts --remove

# Find duplicates manually
npx tsx test-duplicate-contacts.sql
```

---

**Need Help?** All SQL queries are in `cleanup-all-duplicates.sql` with detailed comments.

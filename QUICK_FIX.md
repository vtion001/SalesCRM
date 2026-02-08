# ⚡ QUICK FIX: Remove Duplicates NOW

## You're seeing duplicates because:
1. ✅ The bug is fixed (no new duplicates will be created)
2. ❌ Old duplicates are still in your database

## 🚀 Remove Duplicates in 3 Steps:

### Step 1: Open Supabase
1. Go to your Supabase Dashboard
2. Click **"SQL Editor"** in left sidebar
3. Click **"New query"**

### Step 2: Copy & Run These Queries

**COPY THIS** (safe preview - see what will be deleted):

```sql
SELECT 
    phone,
    COUNT(*) as duplicate_count,
    STRING_AGG(name, ' | ') as names,
    STRING_AGG(company, ' | ') as companies
FROM contacts
WHERE phone IS NOT NULL AND phone != ''
GROUP BY phone
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;
```

👆 This shows you all duplicate contacts. Take note of how many there are.

---

**THEN COPY THIS** (see Westpac duplicates):

```sql
SELECT 
    id,
    name,
    company,
    phone,
    created_at,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) as keep_number
FROM contacts
WHERE company ILIKE '%westpac%'
ORDER BY created_at ASC;
```

👆 `keep_number = 1` will be KEPT, others will be DELETED

---

### Step 3: Delete Duplicates

**COPY AND RUN EACH OF THESE** (one at a time):

#### A. Delete duplicate contacts by phone:
```sql
WITH ranked_contacts AS (
    SELECT 
        id,
        phone,
        created_at,
        ROW_NUMBER() OVER (PARTITION BY phone ORDER BY created_at ASC) as rn
    FROM contacts
    WHERE phone IS NOT NULL AND phone != ''
)
DELETE FROM contacts
WHERE id IN (
    SELECT id FROM ranked_contacts WHERE rn > 1
);
```

#### B. Delete Westpac duplicates:
```sql
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
```

#### C. Delete duplicate contacts by name+company:
```sql
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
    SELECT id FROM ranked_contacts WHERE rn > 1
);
```

#### D. Delete duplicate leads:
```sql
WITH ranked_leads AS (
    SELECT 
        id,
        phone,
        created_at,
        ROW_NUMBER() OVER (PARTITION BY phone ORDER BY created_at ASC) as rn
    FROM leads
    WHERE phone IS NOT NULL AND phone != ''
)
DELETE FROM leads
WHERE id IN (
    SELECT id FROM ranked_leads WHERE rn > 1
);
```

#### E. Delete call activities (they belong in call_history):
```sql
DELETE FROM activities
WHERE 
    title ILIKE '%call%' 
    OR title ILIKE '%incoming%' 
    OR title ILIKE '%outgoing%'
    OR description ILIKE '%call%';
```

---

### Step 4: Verify It Worked

**RUN THIS** to check (should return 0 rows):

```sql
SELECT phone, COUNT(*) 
FROM contacts 
WHERE phone IS NOT NULL 
GROUP BY phone 
HAVING COUNT(*) > 1;
```

**RUN THIS** to check Westpac count (should be 1 or 0):

```sql
SELECT COUNT(*) as westpac_count
FROM contacts
WHERE company ILIKE '%westpac%';
```

---

## ✅ Expected Results:

After running these queries:
- ✓ Only **1 Westpac** contact (oldest kept)
- ✓ No duplicate phone numbers
- ✓ Clean contact list
- ✓ Your app should show no duplicates

---

## 📞 Need More Help?

All queries are also available in:
- `CLEANUP_QUERIES.sh` (run to see all queries)
- `cleanup-all-duplicates.sql` (full SQL file)

---

## 🎯 Summary

1. Open Supabase SQL Editor
2. Run preview queries first
3. Run deletion queries one by one
4. Verify with final check
5. Refresh your app - duplicates should be gone! 🎉

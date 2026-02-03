# Database Cleanup Guide

## Problem
Calls were being logged to **both** `call_history` AND `activities` tables, creating duplicate records in the pipeline.

## Solution Applied

### 1. Code Fix (Already Done ✅)
- Modified `hooks/useDialer.ts` to remove duplicate activity logging
- Calls now only go to `call_history` table
- Future calls will NOT create duplicates

### 2. Check If You Have Duplicates

**First, verify if you actually have duplicate call activities:**

```sql
-- Run this in Supabase SQL Editor
SELECT COUNT(*) as call_activity_count
FROM activities
WHERE 
  title ILIKE '%call%' 
  OR title ILIKE '%incoming%' 
  OR title ILIKE '%outgoing%'
  OR description ILIKE '%call%';
```

**If the count is 0**, you don't have duplicates! The code fix is all you need. ✅

**If the count is > 0**, proceed with cleanup below.

### 3. Database Cleanup (Only If Needed)

#### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open `cleanup-duplicates.sql` from this project
4. **Step 1**: Run the SELECT query to see what will be deleted
5. **Step 2**: Run the COUNT query to see how many records
6. **Step 3**: Uncomment the DELETE statement and run it
7. **Step 4**: Verify deletion with the final SELECT

#### Option B: Using Supabase CLI

```bash
# Connect to your database
supabase db reset --db-url "your-database-url"

# Or run the SQL file directly
psql "your-database-url" < cleanup-duplicates.sql
```

## Troubleshooting

### Error: "relation 'activities' does not exist"

This means the `activities` table hasn't been created yet. This can happen if:
1. You haven't run the Supabase migrations yet
2. You're connected to the wrong database

**Solution:**
```bash
# Run migrations to create all tables
supabase db push

# Or reset and apply all migrations
supabase db reset
```

### No Duplicates Found

If you don't have any duplicate call activities, that's great! The code fix in `useDialer.ts` will prevent future duplicates. You don't need to run the cleanup script.

## What Gets Deleted

The script removes activities where:
- `title` contains "Call", "Incoming", or "Outgoing"
- `description` contains "call"

## What's Preserved

✅ **Call history** in `call_history` table (untouched)  
✅ **All other activities** (notes, emails, tasks, etc.)  
✅ **Leads, contacts, deals** (not affected)

## Guardrails (Optional)

The SQL script includes optional database-level guardrails:
- **Constraint**: Prevents call activities at database level
- **Trigger**: Auto-rejects call activities with error message

These are **optional** - the application-level fix is sufficient.

## Verification

After cleanup, check your pipeline:
- No more duplicate "Westpac" entries
- Call history still visible in Dialer → History tab
- Future calls won't create duplicates

---

**Need help?** Check the comments in `cleanup-duplicates.sql` for detailed explanations.

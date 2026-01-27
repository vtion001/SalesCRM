# Security Migration Guide

## Overview
This migration implements user-specific data isolation through Row Level Security (RLS) policies. After running this migration, each user will only be able to see and modify their own data.

## ✅ What This Migration Does

### 1. Data Ownership
- Adds `user_id` column to: leads, contacts, deals, call_history, sms_messages
- Automatically assigns existing data to the first user (admin@salescrm.com)
- Creates triggers to auto-set user_id on new records

### 2. Secure RLS Policies
- **Before:** Any authenticated user could see ALL data
- **After:** Users can ONLY see their own data
- Separate policies for SELECT, INSERT, UPDATE, DELETE operations

### 3. Audit Logging
- New `audit_logs` table for security monitoring
- Tracks all data modifications with timestamps
- Records user_id, action type, and changed data

### 4. Performance Optimization
- Indexes added on all user_id columns
- Efficient queries for user-specific data filtering

## 🔒 Security Improvements

| Before | After |
|--------|-------|
| User A can see User B's leads | ❌ Access denied |
| User A can edit User B's contacts | ❌ Access denied |
| User A can delete User B's deals | ❌ Access denied |
| All authenticated users share data | ✅ Each user has isolated data |

## 📊 Data Preservation

**Your admin@salescrm.com account data is SAFE:**
- All existing leads, contacts, deals preserved
- All call history and SMS messages retained
- All activities and notes linked correctly
- Data automatically assigned to admin user

## 🚀 How to Apply This Migration

### Option 1: Supabase Dashboard (Recommended)
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New query**
5. Copy the contents of `20250127000002_secure_rls_policies.sql`
6. Paste and click **Run**
7. Verify success message

### Option 2: Supabase CLI
```bash
# Make sure you're in the project directory
cd /Users/archerterminez/Desktop/REPOSITORY/SalesCRM\ -\ Amber/SalesCRM

# Link to your project (if not already linked)
npx supabase link --project-ref YOUR_PROJECT_REF

# Push the migration
npx supabase db push
```

### Option 3: Manual SQL Execution
```bash
# Using psql (if you have direct database access)
psql "postgresql://postgres:[YOUR-PASSWORD]@db.isdogcsgykvplppezpos.supabase.co:5432/postgres" \
  -f supabase/migrations/20250127000002_secure_rls_policies.sql
```

## ✅ Verification Steps

After running the migration, verify it worked:

### 1. Check Tables Have user_id Column
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' AND column_name = 'user_id';
```

Expected: Returns one row showing user_id column exists

### 2. Check Existing Data Has user_id
```sql
SELECT COUNT(*) as total_leads, 
       COUNT(user_id) as leads_with_user 
FROM leads;
```

Expected: total_leads = leads_with_user (all records have user_id)

### 3. Check RLS Policies Exist
```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('leads', 'contacts', 'deals');
```

Expected: Shows 4 policies per table (view, insert, update, delete)

### 4. Test User Isolation
```sql
-- As admin@salescrm.com user
SELECT COUNT(*) FROM leads;  -- Should see your leads

-- Try to access another user's data (should return 0)
SELECT COUNT(*) FROM leads WHERE user_id != auth.uid();
```

Expected: Can only see own data, not other users' data

## 🔧 Rollback Plan (If Needed)

If something goes wrong, you can rollback:

```sql
-- Drop new policies
DROP POLICY IF EXISTS "Users can view their own leads" ON leads;
-- ... (repeat for all new policies)

-- Remove user_id columns
ALTER TABLE leads DROP COLUMN IF EXISTS user_id;
ALTER TABLE contacts DROP COLUMN IF EXISTS user_id;
ALTER TABLE deals DROP COLUMN IF EXISTS user_id;
ALTER TABLE call_history DROP COLUMN IF EXISTS user_id;
ALTER TABLE sms_messages DROP COLUMN IF EXISTS user_id;

-- Restore old permissive policies
CREATE POLICY "Enable all for authenticated users" ON leads 
  FOR ALL USING (auth.role() = 'authenticated');
-- ... (repeat for all tables)

-- Drop audit table
DROP TABLE IF EXISTS audit_logs;
```

## 🎯 Testing the Migration

### Test 1: Admin Can Access Their Data
1. Login as admin@salescrm.com
2. Navigate to Leads, Contacts, Deals
3. Verify all existing data is visible
4. Create a new lead
5. Verify it appears immediately

### Test 2: Auto user_id Assignment
1. Create a new lead through the UI
2. Check the database:
   ```sql
   SELECT id, name, user_id FROM leads ORDER BY created_at DESC LIMIT 1;
   ```
3. Verify user_id matches auth.uid() of logged-in user

### Test 3: Cross-User Isolation
1. Create a second test user in Supabase Dashboard
2. Login as that user
3. Verify they see NO data from admin@salescrm.com
4. Create a lead as the new user
5. Verify admin cannot see the new user's lead

## 📱 Frontend Code Impact

**Good news:** No frontend code changes required! 

The migration includes triggers that automatically set `user_id` when inserting records, so your existing React components will continue working without modifications.

The hooks in `/hooks/` directory already use Supabase client which respects RLS policies automatically.

## ⚠️ Important Notes

1. **Existing Data:** All current data is assigned to the first user (admin@salescrm.com)
2. **New Users:** Each new user starts with a clean slate (no data)
3. **Triggers:** Auto-set user_id on INSERT, so you don't need to manually include it
4. **Performance:** Indexes ensure user-specific queries remain fast
5. **Audit Trail:** All changes are logged in audit_logs table

## 🔐 Security Compliance

This migration helps meet:
- ✅ **SOC 2 Type II:** Data isolation between tenants
- ✅ **GDPR:** User data privacy and access control
- ✅ **HIPAA:** Protected health information separation
- ✅ **PCI DSS:** Cardholder data access restrictions

## 📞 Support

If you encounter issues:
1. Check Supabase logs in Dashboard → Logs
2. Verify RLS is enabled: `SELECT tablename FROM pg_tables WHERE tablename = 'leads' AND rowsecurity = true;`
3. Check trigger status: `SELECT trigger_name FROM information_schema.triggers WHERE trigger_schema = 'public';`
4. Review error messages for policy violations

## Next Steps After Migration

1. ✅ Verify admin@salescrm.com can access all data
2. ✅ Test creating new leads/contacts/deals
3. ✅ Create a test user and verify data isolation
4. ✅ Review audit_logs table structure
5. ⏭️ Proceed with MFA implementation

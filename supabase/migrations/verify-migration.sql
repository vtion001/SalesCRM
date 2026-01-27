-- Verification Queries - Run these AFTER migration completes
-- Copy and paste these one at a time to verify the migration worked

-- 1. Check if user_id column exists in all tables
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE column_name = 'user_id' 
AND table_schema = 'public'
AND table_name IN ('leads', 'contacts', 'deals', 'call_history', 'sms_messages')
ORDER BY table_name;
-- Expected: 5 rows (one for each table)

-- 2. Check if all records have user_id assigned
SELECT 
    'leads' as table_name,
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id,
    CASE WHEN COUNT(*) = COUNT(user_id) THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM leads
UNION ALL
SELECT 
    'contacts' as table_name,
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id,
    CASE WHEN COUNT(*) = COUNT(user_id) THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM contacts
UNION ALL
SELECT 
    'deals' as table_name,
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id,
    CASE WHEN COUNT(*) = COUNT(user_id) THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM deals
UNION ALL
SELECT 
    'call_history' as table_name,
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id,
    CASE WHEN COUNT(*) = COUNT(user_id) THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM call_history
UNION ALL
SELECT 
    'sms_messages' as table_name,
    COUNT(*) as total_records,
    COUNT(user_id) as records_with_user_id,
    CASE WHEN COUNT(*) = COUNT(user_id) THEN '✅ PASS' ELSE '❌ FAIL' END as status
FROM sms_messages;
-- Expected: All rows show ✅ PASS

-- 3. Verify RLS policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('leads', 'contacts', 'deals', 'activities', 'notes', 'call_history', 'sms_messages')
ORDER BY tablename, policyname;
-- Expected: 4 policies per table (SELECT, INSERT, UPDATE, DELETE)

-- 4. Verify triggers were created
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name LIKE 'set_%_user_id'
ORDER BY event_object_table;
-- Expected: 5 triggers (one for each table with user_id)

-- 5. Verify audit_logs table was created
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'audit_logs'
) as audit_logs_exists;
-- Expected: true

-- 6. Check indexes were created
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%_user_id'
ORDER BY tablename;
-- Expected: 7 indexes (5 for tables + 2 for audit_logs)

-- 7. Get the admin user's UUID (for reference)
SELECT 
    id as user_id,
    email,
    created_at
FROM auth.users
ORDER BY created_at
LIMIT 1;
-- Expected: Shows admin@salescrm.com with their UUID

-- 8. Verify data ownership (all records should belong to first user)
WITH first_user AS (
    SELECT id FROM auth.users ORDER BY created_at LIMIT 1
)
SELECT 
    'leads' as table_name,
    COUNT(*) as admin_owned_records
FROM leads, first_user
WHERE leads.user_id = first_user.id
UNION ALL
SELECT 
    'contacts' as table_name,
    COUNT(*) as admin_owned_records
FROM contacts, first_user
WHERE contacts.user_id = first_user.id
UNION ALL
SELECT 
    'deals' as table_name,
    COUNT(*) as admin_owned_records
FROM deals, first_user
WHERE deals.user_id = first_user.id;
-- Expected: Shows count of records owned by admin@salescrm.com

-- 9. Test RLS policy (simulate user trying to see their own data)
-- This should return data if you're logged in as admin@salescrm.com
SELECT COUNT(*) as my_leads FROM leads WHERE user_id = auth.uid();
-- Expected: Returns your lead count (should match total leads)

-- 10. Final health check - Everything should be ✅
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.columns WHERE column_name = 'user_id' AND table_schema = 'public') >= 5 
        THEN '✅' 
        ELSE '❌' 
    END as user_id_columns,
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') >= 20 
        THEN '✅' 
        ELSE '❌' 
    END as rls_policies,
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public' AND trigger_name LIKE 'set_%') >= 5 
        THEN '✅' 
        ELSE '❌' 
    END as triggers,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') 
        THEN '✅' 
        ELSE '❌' 
    END as audit_table,
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_indexes WHERE indexname LIKE 'idx_%_user_id') >= 5 
        THEN '✅' 
        ELSE '❌' 
    END as indexes;
-- Expected: All ✅

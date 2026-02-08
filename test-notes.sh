#!/bin/bash

# Quick Notes Functionality Test
# Run this to display test queries for Supabase

cat << 'EOF'

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              📝 NOTES FUNCTIONALITY TEST                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

🎯 TEST OBJECTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verify that notes are:
  ✓ Saved to database correctly
  ✓ Associated with the right lead
  ✓ Logged as activities
  ✓ Displayed in UI properly

📋 MANUAL TEST STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Start the app:
   $ npm run dev

2. Login to your account

3. Select a lead from the pipeline

4. Scroll to "Private Notes" section

5. Click "+ Add Note" button

6. Type this test note:
   "Test note - verifying storage at $(date)"

7. Click "Commit Note" button

8. Check for toast notification: "Note saved"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 VERIFICATION QUERIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run these in Supabase SQL Editor to verify:


1️⃣  CHECK IF NOTE WAS SAVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
    id,
    content,
    author,
    is_pinned,
    lead_id,
    user_id,
    created_at
FROM notes 
WHERE content ILIKE '%Test note%'
ORDER BY created_at DESC 
LIMIT 5;

Expected: Should show your test note with:
  ✓ content: Your test note text
  ✓ author: "Me"
  ✓ is_pinned: false
  ✓ lead_id: UUID of selected lead
  ✓ user_id: Your user UUID
  ✓ created_at: Recent timestamp


2️⃣  CHECK IF ACTIVITY WAS LOGGED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
    id,
    type,
    title,
    description,
    lead_id,
    user_id,
    created_at
FROM activities 
WHERE type = 'note'
AND description ILIKE '%Test note%'
ORDER BY created_at DESC 
LIMIT 5;

Expected: Should show activity with:
  ✓ type: "note"
  ✓ title: "Note Added"
  ✓ description: First 60 chars of your note
  ✓ lead_id: Same UUID as note
  ✓ created_at: Same timestamp as note


3️⃣  CHECK NOTES WITH LEAD INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
    n.id as note_id,
    n.content,
    n.author,
    n.created_at as note_date,
    l.name as lead_name,
    l.company as lead_company
FROM notes n
LEFT JOIN leads l ON l.id = n.lead_id
ORDER BY n.created_at DESC
LIMIT 10;

Expected: Should show your note with correct lead association


4️⃣  CHECK TOTAL COUNTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT 
    'Notes' as table_name,
    COUNT(*) as total,
    COUNT(CASE WHEN lead_id IS NOT NULL THEN 1 END) as with_lead,
    COUNT(CASE WHEN lead_id IS NULL THEN 1 END) as without_lead
FROM notes

UNION ALL

SELECT 
    'Activities (Notes)' as table_name,
    COUNT(*) as total,
    COUNT(CASE WHEN lead_id IS NOT NULL THEN 1 END) as with_lead,
    COUNT(CASE WHEN lead_id IS NULL THEN 1 END) as without_lead
FROM activities
WHERE type = 'note';


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ SUCCESS CRITERIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test passes if:
  ✓ Query #1 returns your test note
  ✓ Query #2 returns corresponding activity
  ✓ Both have same lead_id
  ✓ Both have same user_id
  ✓ Timestamps are within 1 second of each other
  ✓ Note visible in UI Private Notes section
  ✓ Activity visible in Activity Timeline

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 COMMON ISSUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue: "Note not saved"
  → Check if you're logged in
  → Check browser console for errors
  → Verify Supabase connection

Issue: "Note saved but not showing"
  → Refresh the page
  → Check if correct lead is selected
  → Run query #1 to verify it's in database

Issue: "Activity not logged"
  → Check query #2
  → Verify activities table permissions
  → Check console for errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 DETAILED REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

See: NOTES_TEST_REPORT.md

This includes:
  • Full code analysis
  • Database schema
  • Implementation details
  • Troubleshooting guide
  • All test scenarios

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ CODE ANALYSIS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Notes functionality is PROPERLY IMPLEMENTED:

  ✓ useNotes hook handles database operations
  ✓ LeadDetail component has Add Note UI
  ✓ App.tsx wires everything together
  ✓ Proper error handling with toast notifications
  ✓ Authentication required for adding notes
  ✓ Dual logging (notes table + activities table)
  ✓ Correct field mapping (camelCase ↔ snake_case)

Ready for testing! 🎉

EOF

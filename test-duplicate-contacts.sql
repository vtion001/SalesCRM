-- SQL Query to check for duplicate contacts in the database
-- Run this in your Supabase SQL Editor or psql console

-- Find duplicate phone numbers in contacts table
SELECT 
    phone,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as contact_ids,
    STRING_AGG(name, ' | ') as names
FROM contacts
WHERE phone IS NOT NULL AND phone != ''
GROUP BY phone
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Find duplicate emails in contacts table
SELECT 
    email,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as contact_ids,
    STRING_AGG(name, ' | ') as names
FROM contacts
WHERE email IS NOT NULL AND email != ''
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Total contacts
SELECT COUNT(*) as total_contacts FROM contacts;

-- Contacts with duplicate phone numbers (count)
SELECT COUNT(DISTINCT phone) as unique_phones,
       COUNT(*) as total_contacts,
       COUNT(*) - COUNT(DISTINCT phone) as duplicate_entries
FROM contacts
WHERE phone IS NOT NULL AND phone != '';

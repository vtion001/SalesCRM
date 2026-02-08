/**
 * Script to remove duplicate contacts from the database
 * Run this with: npx tsx fix-duplicate-contacts.ts
 */

import { createClient } from '@supabase/supabase-js';

// You'll need to set these environment variables or replace with your values
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

interface Contact {
  id: string;
  phone: string;
  email: string;
  name: string;
  created_at: string;
}

async function findDuplicateContacts() {
  console.log('🔍 Searching for duplicate contacts...\n');

  // Fetch all contacts
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error fetching contacts:', error);
    return;
  }

  if (!contacts || contacts.length === 0) {
    console.log('ℹ️  No contacts found in database');
    return;
  }

  console.log(`📊 Total contacts: ${contacts.length}`);

  // Group by phone number
  const phoneGroups = new Map<string, Contact[]>();
  contacts.forEach((contact: Contact) => {
    if (contact.phone) {
      const normalized = contact.phone.replace(/\D/g, '');
      if (normalized) {
        if (!phoneGroups.has(normalized)) {
          phoneGroups.set(normalized, []);
        }
        phoneGroups.get(normalized)!.push(contact);
      }
    }
  });

  // Find duplicates
  const duplicates: Array<{ phone: string; contacts: Contact[] }> = [];
  phoneGroups.forEach((group, phone) => {
    if (group.length > 1) {
      duplicates.push({ phone, contacts: group });
    }
  });

  if (duplicates.length === 0) {
    console.log('✅ No duplicate contacts found!');
    return;
  }

  console.log(`\n⚠️  Found ${duplicates.length} duplicate phone numbers:\n`);

  duplicates.forEach(({ phone, contacts }, index) => {
    console.log(`${index + 1}. Phone: ${phone} (${contacts[0].phone})`);
    console.log(`   📞 ${contacts.length} duplicate entries:`);
    contacts.forEach((contact, i) => {
      console.log(`      ${i + 1}. ${contact.name} (ID: ${contact.id.slice(0, 8)}...) - Created: ${new Date(contact.created_at).toLocaleString()}`);
    });
    console.log('');
  });

  return duplicates;
}

async function removeDuplicates(dryRun: boolean = true) {
  const duplicates = await findDuplicateContacts();

  if (!duplicates || duplicates.length === 0) {
    return;
  }

  console.log(`\n${dryRun ? '🔍 DRY RUN MODE' : '🗑️  REMOVAL MODE'}`);
  console.log('Strategy: Keep oldest contact, remove newer duplicates\n');

  let totalRemoved = 0;

  for (const { phone, contacts } of duplicates) {
    // Sort by creation date (oldest first)
    const sorted = contacts.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Keep the first (oldest), remove the rest
    const toKeep = sorted[0];
    const toRemove = sorted.slice(1);

    console.log(`📞 Phone: ${phone}`);
    console.log(`   ✅ Keeping: ${toKeep.name} (ID: ${toKeep.id.slice(0, 8)}...)`);
    console.log(`   ❌ Removing: ${toRemove.length} duplicate(s)`);

    if (!dryRun) {
      for (const contact of toRemove) {
        const { error } = await supabase
          .from('contacts')
          .delete()
          .eq('id', contact.id);

        if (error) {
          console.error(`   ❌ Error removing ${contact.id}:`, error);
        } else {
          console.log(`   🗑️  Removed: ${contact.name} (ID: ${contact.id.slice(0, 8)}...)`);
          totalRemoved++;
        }
      }
    } else {
      totalRemoved += toRemove.length;
    }
    console.log('');
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Duplicate groups found: ${duplicates.length}`);
  console.log(`   Contacts to remove: ${totalRemoved}`);
  
  if (dryRun) {
    console.log(`\n💡 This was a DRY RUN. No changes were made.`);
    console.log(`   To actually remove duplicates, run: npx tsx fix-duplicate-contacts.ts --remove`);
  } else {
    console.log(`\n✅ Removed ${totalRemoved} duplicate contacts successfully!`);
  }
}

// Main execution
const args = process.argv.slice(2);
const shouldRemove = args.includes('--remove') || args.includes('-r');

removeDuplicates(!shouldRemove).catch(console.error);

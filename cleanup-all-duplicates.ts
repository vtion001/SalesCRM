#!/usr/bin/env tsx
/**
 * Comprehensive Duplicate Cleanup Script
 * 
 * Removes ALL types of duplicates:
 * - Duplicate contacts (by phone, email, name+company)
 * - Duplicate leads (by phone)
 * - Duplicate call activities
 * - Specific: Multiple "Westpac" entries
 * 
 * Usage:
 *   npx tsx cleanup-all-duplicates.ts              # Dry run (preview only)
 *   npx tsx cleanup-all-duplicates.ts --remove     # Actually remove duplicates
 */

import { createClient } from '@supabase/supabase-js';

// Load from environment or replace with your values
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface DuplicateGroup {
  key: string;
  records: any[];
  keepId: string;
  removeIds: string[];
}

async function findDuplicateContacts(): Promise<{
  byPhone: DuplicateGroup[];
  byEmail: DuplicateGroup[];
  byNameCompany: DuplicateGroup[];
}> {
  console.log('🔍 Finding duplicate contacts...\n');

  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error fetching contacts:', error);
    return { byPhone: [], byEmail: [], byNameCompany: [] };
  }

  if (!contacts || contacts.length === 0) {
    console.log('ℹ️  No contacts found');
    return { byPhone: [], byEmail: [], byNameCompany: [] };
  }

  // Group by phone
  const phoneGroups = new Map<string, any[]>();
  contacts.forEach(contact => {
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

  // Group by email
  const emailGroups = new Map<string, any[]>();
  contacts.forEach(contact => {
    if (contact.email) {
      const normalized = contact.email.toLowerCase().trim();
      if (normalized) {
        if (!emailGroups.has(normalized)) {
          emailGroups.set(normalized, []);
        }
        emailGroups.get(normalized)!.push(contact);
      }
    }
  });

  // Group by name + company (for cases like "Westpac")
  const nameCompanyGroups = new Map<string, any[]>();
  contacts.forEach(contact => {
    if (contact.name && contact.company) {
      const key = `${contact.name.toLowerCase()}:${contact.company.toLowerCase()}`;
      if (!nameCompanyGroups.has(key)) {
        nameCompanyGroups.set(key, []);
      }
      nameCompanyGroups.get(key)!.push(contact);
    }
  });

  // Extract duplicates
  const getDuplicates = (groups: Map<string, any[]>): DuplicateGroup[] => {
    const duplicates: DuplicateGroup[] = [];
    groups.forEach((records, key) => {
      if (records.length > 1) {
        // Keep oldest (first in sorted list)
        const sorted = records.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        duplicates.push({
          key,
          records: sorted,
          keepId: sorted[0].id,
          removeIds: sorted.slice(1).map(r => r.id)
        });
      }
    });
    return duplicates;
  };

  return {
    byPhone: getDuplicates(phoneGroups),
    byEmail: getDuplicates(emailGroups),
    byNameCompany: getDuplicates(nameCompanyGroups)
  };
}

async function findDuplicateLeads(): Promise<DuplicateGroup[]> {
  console.log('🔍 Finding duplicate leads...\n');

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error fetching leads:', error);
    return [];
  }

  if (!leads || leads.length === 0) {
    console.log('ℹ️  No leads found');
    return [];
  }

  // Group by phone
  const phoneGroups = new Map<string, any[]>();
  leads.forEach(lead => {
    if (lead.phone) {
      const normalized = lead.phone.replace(/\D/g, '');
      if (normalized) {
        if (!phoneGroups.has(normalized)) {
          phoneGroups.set(normalized, []);
        }
        phoneGroups.get(normalized)!.push(lead);
      }
    }
  });

  const duplicates: DuplicateGroup[] = [];
  phoneGroups.forEach((records, key) => {
    if (records.length > 1) {
      const sorted = records.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      duplicates.push({
        key,
        records: sorted,
        keepId: sorted[0].id,
        removeIds: sorted.slice(1).map(r => r.id)
      });
    }
  });

  return duplicates;
}

async function findCallActivities(): Promise<any[]> {
  console.log('🔍 Finding call activities (should be in call_history only)...\n');

  const { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .or('title.ilike.%call%,title.ilike.%incoming%,title.ilike.%outgoing%,description.ilike.%call%')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching activities:', error);
    return [];
  }

  return activities || [];
}

async function removeDuplicates(dryRun: boolean = true) {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                                                              ║');
  console.log('║         COMPREHENSIVE DUPLICATE CLEANUP                      ║');
  console.log('║                                                              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  console.log(`Mode: ${dryRun ? '🔍 DRY RUN (Preview Only)' : '🗑️  REMOVAL MODE'}\n`);

  // Find all duplicates
  const contactDuplicates = await findDuplicateContacts();
  const leadDuplicates = await findDuplicateLeads();
  const callActivities = await findCallActivities();

  let totalRemoved = 0;

  // Process duplicate contacts by phone
  if (contactDuplicates.byPhone.length > 0) {
    console.log('\n📱 DUPLICATE CONTACTS BY PHONE');
    console.log('━'.repeat(60));
    
    contactDuplicates.byPhone.forEach((group, index) => {
      console.log(`\n${index + 1}. Phone: ${group.records[0].phone}`);
      console.log(`   ✅ KEEP: ${group.records[0].name} (${group.records[0].company}) - ${new Date(group.records[0].created_at).toLocaleString()}`);
      
      group.removeIds.forEach((id, i) => {
        const record = group.records.find(r => r.id === id);
        console.log(`   ❌ DELETE: ${record.name} (${record.company}) - ${new Date(record.created_at).toLocaleString()}`);
      });

      if (!dryRun) {
        group.removeIds.forEach(async (id) => {
          const { error } = await supabase.from('contacts').delete().eq('id', id);
          if (error) {
            console.error(`   ❌ Error removing ${id}:`, error);
          } else {
            totalRemoved++;
          }
        });
      } else {
        totalRemoved += group.removeIds.length;
      }
    });
  }

  // Process duplicate contacts by name+company (Westpac, etc.)
  if (contactDuplicates.byNameCompany.length > 0) {
    console.log('\n\n🏢 DUPLICATE CONTACTS BY NAME+COMPANY');
    console.log('━'.repeat(60));
    
    contactDuplicates.byNameCompany.forEach((group, index) => {
      const [name, company] = group.key.split(':');
      console.log(`\n${index + 1}. ${name} @ ${company}`);
      console.log(`   Found ${group.records.length} duplicates`);
      console.log(`   ✅ KEEP: ${group.records[0].name} - ${new Date(group.records[0].created_at).toLocaleString()}`);
      
      group.removeIds.forEach((id, i) => {
        const record = group.records.find(r => r.id === id);
        console.log(`   ❌ DELETE: ${record.name} - ${new Date(record.created_at).toLocaleString()}`);
      });

      if (!dryRun) {
        group.removeIds.forEach(async (id) => {
          const { error } = await supabase.from('contacts').delete().eq('id', id);
          if (error) {
            console.error(`   ❌ Error removing ${id}:`, error);
          } else {
            totalRemoved++;
          }
        });
      } else {
        totalRemoved += group.removeIds.length;
      }
    });
  }

  // Process duplicate leads
  if (leadDuplicates.length > 0) {
    console.log('\n\n💼 DUPLICATE LEADS BY PHONE');
    console.log('━'.repeat(60));
    
    leadDuplicates.forEach((group, index) => {
      console.log(`\n${index + 1}. Phone: ${group.records[0].phone}`);
      console.log(`   ✅ KEEP: ${group.records[0].name} - ${new Date(group.records[0].created_at).toLocaleString()}`);
      
      group.removeIds.forEach((id, i) => {
        const record = group.records.find(r => r.id === id);
        console.log(`   ❌ DELETE: ${record.name} - ${new Date(record.created_at).toLocaleString()}`);
      });

      if (!dryRun) {
        group.removeIds.forEach(async (id) => {
          const { error } = await supabase.from('leads').delete().eq('id', id);
          if (error) {
            console.error(`   ❌ Error removing ${id}:`, error);
          } else {
            totalRemoved++;
          }
        });
      } else {
        totalRemoved += group.removeIds.length;
      }
    });
  }

  // Process call activities (should be removed - they belong in call_history)
  if (callActivities.length > 0) {
    console.log('\n\n📞 CALL ACTIVITIES (Should be in call_history instead)');
    console.log('━'.repeat(60));
    console.log(`Found ${callActivities.length} call activities to remove\n`);
    
    callActivities.slice(0, 5).forEach(activity => {
      console.log(`   ❌ ${activity.title} - ${new Date(activity.created_at).toLocaleString()}`);
    });

    if (callActivities.length > 5) {
      console.log(`   ... and ${callActivities.length - 5} more`);
    }

    if (!dryRun) {
      const { error } = await supabase
        .from('activities')
        .delete()
        .or('title.ilike.%call%,title.ilike.%incoming%,title.ilike.%outgoing%,description.ilike.%call%');

      if (error) {
        console.error('   ❌ Error removing call activities:', error);
      } else {
        totalRemoved += callActivities.length;
      }
    } else {
      totalRemoved += callActivities.length;
    }
  }

  // Summary
  console.log('\n\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                         SUMMARY                              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  console.log(`📊 Duplicate contacts by phone:       ${contactDuplicates.byPhone.length} groups`);
  console.log(`📊 Duplicate contacts by name+company: ${contactDuplicates.byNameCompany.length} groups`);
  console.log(`📊 Duplicate leads by phone:          ${leadDuplicates.length} groups`);
  console.log(`📊 Call activities to remove:         ${callActivities.length} records`);
  console.log(`\n${dryRun ? '📝' : '🗑️ '} Total records to ${dryRun ? 'be ' : ''}removed:    ${totalRemoved}`);

  if (dryRun) {
    console.log('\n💡 This was a DRY RUN. No changes were made.');
    console.log('   To actually remove duplicates, run:');
    console.log('   npx tsx cleanup-all-duplicates.ts --remove\n');
  } else {
    console.log(`\n✅ Successfully removed ${totalRemoved} duplicate records!\n`);
  }

  // Final verification
  console.log('\n🔍 Verification:');
  const { count: contactCount } = await supabase.from('contacts').select('*', { count: 'exact', head: true });
  const { count: leadCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
  const { count: activityCount } = await supabase
    .from('activities')
    .select('*', { count: 'exact', head: true })
    .or('title.ilike.%call%,title.ilike.%incoming%,title.ilike.%outgoing%');

  console.log(`   Total contacts remaining:     ${contactCount}`);
  console.log(`   Total leads remaining:        ${leadCount}`);
  console.log(`   Call activities remaining:    ${activityCount || 0}`);
}

// Main execution
const args = process.argv.slice(2);
const shouldRemove = args.includes('--remove') || args.includes('-r');

removeDuplicates(!shouldRemove).catch(console.error);

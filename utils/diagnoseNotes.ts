import { supabase } from '../services/supabaseClient';

export const diagnoseNotesIssue = async () => {
  const diagnostics: string[] = [];
  
  try {
    // 1. Check Supabase client configuration
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    diagnostics.push('=== SUPABASE CONFIGURATION ===');
    diagnostics.push(`URL configured: ${!!supabaseUrl}`);
    diagnostics.push(`Anon key configured: ${!!supabaseKey}`);
    diagnostics.push(`URL: ${supabaseUrl?.substring(0, 20)}...`);
    
    // 2. Check authentication status
    diagnostics.push('\n=== AUTHENTICATION ===');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      diagnostics.push(`❌ Session error: ${sessionError.message}`);
    } else if (sessionData?.session) {
      diagnostics.push(`✅ User authenticated: ${sessionData.session.user.email}`);
      diagnostics.push(`User ID: ${sessionData.session.user.id}`);
    } else {
      diagnostics.push(`❌ No active session - user must log in`);
    }
    
    // 3. Check notes table accessibility
    diagnostics.push('\n=== NOTES TABLE ACCESS ===');
    const { data: notesData, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .limit(1);
    
    if (notesError) {
      diagnostics.push(`❌ Cannot access notes table: ${notesError.message}`);
      diagnostics.push(`Error code: ${notesError.code}`);
      diagnostics.push(`Error hint: ${notesError.hint || 'none'}`);
    } else {
      diagnostics.push(`✅ Notes table accessible`);
      diagnostics.push(`Found ${notesData?.length || 0} sample notes`);
    }
    
    // 4. Test insert capability
    if (sessionData?.session) {
      diagnostics.push('\n=== INSERT TEST ===');
      const testNote = {
        content: 'Test note from diagnostic',
        is_pinned: false,
        author: 'Diagnostic',
        lead_id: null,
        user_id: sessionData.session.user.id
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('notes')
        .insert([testNote])
        .select()
        .single();
      
      if (insertError) {
        diagnostics.push(`❌ Cannot insert note: ${insertError.message}`);
        diagnostics.push(`Error code: ${insertError.code}`);
        diagnostics.push(`Error details: ${insertError.details}`);
        diagnostics.push(`Error hint: ${insertError.hint || 'none'}`);
      } else {
        diagnostics.push(`✅ Successfully inserted test note`);
        diagnostics.push(`Note ID: ${insertData.id}`);
        
        // Clean up test note
        await supabase.from('notes').delete().eq('id', insertData.id);
        diagnostics.push(`✅ Test note cleaned up`);
      }
    }
    
  } catch (err: any) {
    diagnostics.push(`\n❌ UNEXPECTED ERROR: ${err.message}`);
    diagnostics.push(`Stack: ${err.stack}`);
  }
  
  return diagnostics.join('\n');
};

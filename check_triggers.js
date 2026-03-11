import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhqtewsbfqvxuxwtdiqb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocXRld3NiZnF2eHV4d3RkaXFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzQxOTYsImV4cCI6MjA4ODcxMDE5Nn0.939Z8wXSHu1jCB0EgS6Xkdzhkok1bBv8SdwbcvF-1O8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTriggers() {
  const { data, error } = await supabase.from('information_schema.triggers').select('*');
  console.log("Triggers:", data);
  console.log("Error:", error);
}

checkTriggers();

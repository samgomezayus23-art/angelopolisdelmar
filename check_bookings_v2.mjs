import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const env = dotenv.parse(envContent);

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  async function check() {
    const { data: cabana } = await supabase.from('properties').select('id, name').ilike('name', '%Cabaña%').single();
    if (!cabana) {
        console.log('No Cabaña found');
        return;
    }
    console.log('Cabaña ID:', cabana.id);

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('property_id', cabana.id)
      .order('check_in', { ascending: true });

    if (error) {
      console.log('Error:', error.message);
    } else {
      console.log('Bookings for Cabaña:');
      data.forEach(b => {
          console.log(`${b.check_in} to ${b.check_out} | Status: ${b.status} | Source: ${b.source}`);
      });
    }
  }

  check();
} catch (e) {
  console.log('Script Error:', e.message);
}

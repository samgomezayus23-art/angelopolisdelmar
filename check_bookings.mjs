import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

const envContent = fs.readFileSync('antigravity/scratch/cartagena-rentals/.env.local', 'utf8');
const env = dotenv.parse(envContent);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: cabana } = await supabase.from('properties').select('id, name').ilike('name', '%Cabaña%').single();
  console.log('Cabaña ID:', cabana.id);

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', cabana.id)
    .order('check_in', { ascending: true });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Bookings for Cabaña:');
    console.table(data.map(b => ({
      id: b.id.substring(0,8),
      check_in: b.check_in,
      check_out: b.check_out,
      status: b.status,
      source: b.source
    })));
  }
}

check();

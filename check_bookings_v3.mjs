import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

async function main() {
  process.stdout.write('Checking database...\n');
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const env = dotenv.parse(envContent);

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: properties } = await supabase.from('properties').select('id, name');
  process.stdout.write('Found properties: ' + JSON.stringify(properties) + '\n');

  const cabana = properties.find(p => p.name.includes('Cabaña'));
  if (cabana) {
    const { data: bookings } = await supabase.from('bookings').select('*').eq('property_id', cabana.id);
    process.stdout.write(`Found ${bookings.length} bookings for Cabaña\n`);
    bookings.forEach(b => {
      process.stdout.write(`- ${b.check_in} to ${b.check_out} (${b.status})\n`);
    });
  } else {
    process.stdout.write('Cabaña not found in properties list\n');
  }
}

main().catch(e => process.stdout.write('ERROR: ' + e.message + '\n'));

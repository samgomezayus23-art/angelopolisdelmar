import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Read .env.local manually
const envContent = fs.readFileSync('antigravity/scratch/cartagena-rentals/.env.local', 'utf8');
const env = dotenv.parse(envContent);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const feeds = [
  {
    property_id: '2564495f-9b63-4269-8b2d-6eb77e340a1c',
    platform: 'airbnb',
    feed_url: 'https://www.airbnb.com.co/calendar/ical/760303830990358226.ics?t=95bdf1ed1ead4bf3a1f0185f4ba8841f'
  },
  {
    property_id: 'e6fbd744-8d92-47f1-a62c-aaf864ee3692',
    platform: 'airbnb',
    feed_url: 'https://www.airbnb.com.co/calendar/ical/33117049.ics?t=99bd66c1fba4462a9d9b6744bbc29258'
  },
  {
    property_id: '5ecbec5e-da1b-4c1f-85b7-a9ca4051085f',
    platform: 'airbnb',
    feed_url: 'https://www.airbnb.com.co/calendar/ical/45525963.ics?t=b0734399b3a748399b6eb8ba81af4bbc'
  },
  {
    property_id: 'a7bf9bed-16ee-41a8-81fc-99f9b679f34a',
    platform: 'airbnb',
    feed_url: 'https://www.airbnb.com.co/calendar/ical/39808884.ics?t=a45e022c056847ba9ec9a32367b585d0'
  }
];

async function sync() {
  for (const feed of feeds) {
    console.log(`Syncing ${feed.platform} link for property ${feed.property_id}...`);
    const { error } = await supabase
      .from('ical_feeds')
      .upsert(feed, { onConflict: 'property_id,platform' });
    
    if (error) console.error(`Error syncing ${feed.property_id}:`, error);
    else console.log(`Successfully synced ${feed.property_id}`);
  }
}

sync();

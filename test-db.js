const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function test() {
    const propertyId = '2564495f-9b63-4269-8b2d-6eb77e340a1c'; // ApartaSuite
    const checkIn = '2025-12-18';
    const checkOut = '2025-12-20';

    console.log(`Checking overlap for ${propertyId} from ${checkIn} to ${checkOut}...`);

    const { data, error } = await supabase
        .from('bookings')
        .select('id, property_id, check_in, check_out, status')
        .in('property_id', [propertyId])
        .in('status', ['confirmed', 'pending'])
        .lt('check_in', checkOut)
        .gt('check_out', checkIn);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Found overlapping bookings:', data.length);
    data.forEach(b => {
        console.log(`- Booking ${b.id}: ${b.check_in} to ${b.check_out} (${b.status})`);
    });

    if (data.length > 0) {
        console.log('RESULT: BLOCKED');
    } else {
        console.log('RESULT: AVAILABLE');
    }
}

test();

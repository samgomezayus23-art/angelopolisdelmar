const { createClient } = require('@supabase/supabase-js');
const ICAL = require('ical.js');

const supabase = createClient('https://pvtqrrszzisycvklkrwa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dHFycnN6emlzeWN2a2xrcndhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDg1Nzk3NCwiZXhwIjoyMDgwNDMzOTc0fQ.1eHfRvAFnGryeIjgLNCSqBeUE09nbbBaMbY4MB5pvIU');

async function sync() {
    console.log('Starting iCal sync...');
    const { data: feeds, error } = await supabase
        .from('ical_feeds')
        .select('*');

    if (error) {
        console.error('Error fetching feeds:', error);
        return;
    }

    console.log(`Found ${feeds.length} feeds to sync.`);

    for (const feed of feeds) {
        console.log(`Syncing ${feed.platform} for property ${feed.property_id}...`);
        try {
            const response = await fetch(feed.feed_url);
            const icalText = await response.text();
            const jcalData = ICAL.parse(icalText);
            const comp = new ICAL.Component(jcalData);
            const vevents = comp.getAllSubcomponents('vevent');

            console.log(`Found ${vevents.length} events in feed.`);

            for (const vevent of vevents) {
                const event = new ICAL.Event(vevent);
                const checkIn = event.startDate.toJSDate().toISOString().split('T')[0];
                const checkOut = event.endDate.toJSDate().toISOString().split('T')[0];

                // Check if booking exists
                const { data: existing } = await supabase
                    .from('bookings')
                    .select('id')
                    .eq('property_id', feed.property_id)
                    .eq('check_in', checkIn)
                    .eq('check_out', checkOut)
                    .single();

                if (!existing) {
                    console.log(`Creating new booking: ${checkIn} to ${checkOut}`);
                    await supabase.from('bookings').insert({
                        property_id: feed.property_id,
                        guest_name: 'Airbnb Guest',
                        guest_email: 'airbnb@sync.com',
                        check_in: checkIn,
                        check_out: checkOut,
                        guests_count: 1,
                        total_price: 0,
                        status: 'confirmed',
                        payment_status: 'paid',
                        source: 'airbnb'
                    });
                }
            }

            await supabase
                .from('ical_feeds')
                .update({ last_synced: new Date().toISOString() })
                .eq('id', feed.id);

        } catch (err) {
            console.error(`Error syncing feed ${feed.id}:`, err.message);
        }
    }
    console.log('Sync complete!');
}

sync();

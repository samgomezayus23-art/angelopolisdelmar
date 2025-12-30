import ICAL from 'ical.js';
import { getServiceSupabase } from './supabase';
import { parseISO } from 'date-fns';

/**
 * Parse iCal feed and extract bookings
 */
export async function parseICalFeed(icalUrl: string) {
    try {
        const response = await fetch(icalUrl);
        const icalData = await response.text();

        const jcalData = ICAL.parse(icalData);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');

        const bookings = vevents.map((vevent) => {
            const event = new ICAL.Event(vevent);

            return {
                summary: event.summary,
                startDate: event.startDate.toJSDate().toISOString().split('T')[0],
                endDate: event.endDate.toJSDate().toISOString().split('T')[0],
                uid: event.uid,
            };
        });

        return bookings;
    } catch (error) {
        console.error('Error parsing iCal feed:', error);
        throw error;
    }
}

/**
 * Sync iCal feed for a property
 */
export async function syncICalFeed(propertyId: string, platform: string) {
    // Get the iCal feed URL
    const supabase = getServiceSupabase();
    const { data: feedConfig, error: feedError } = await supabase
        .from('ical_feeds')
        .select('feed_url')
        .eq('property_id', propertyId)
        .eq('platform', platform)
        .eq('sync_enabled', true)
        .single();

    if (feedError || !feedConfig) {
        throw new Error('iCal feed not configured');
    }

    // Parse the feed
    const externalBookings = await parseICalFeed(feedConfig.feed_url);

    // Create or update bookings from external sources
    for (const booking of externalBookings) {
        // Check if booking already exists
        const { data: existing } = await getServiceSupabase()
            .from('bookings')
            .select('id')
            .eq('property_id', propertyId)
            .eq('source', platform)
            .eq('check_in', booking.startDate)
            .eq('check_out', booking.endDate)
            .single();

        if (!existing) {
            // Create new booking
            await getServiceSupabase().from('bookings').insert({
                property_id: propertyId,
                guest_name: `${platform} Guest`,
                guest_email: `sync@${platform}.com`,
                check_in: booking.startDate,
                check_out: booking.endDate,
                guests_count: 1,
                total_price: 0,
                status: 'confirmed',
                payment_status: 'paid',
                source: platform,
            });
        }
    }

    // Update last synced timestamp
    await getServiceSupabase()
        .from('ical_feeds')
        .update({ last_synced: new Date().toISOString() })
        .eq('property_id', propertyId)
        .eq('platform', platform);

    return { success: true, bookingsCount: externalBookings.length };
}

/**
 * Sync all active iCal feeds
 */
export async function syncAllFeeds() {
    const { data: feeds, error } = await getServiceSupabase()
        .from('ical_feeds')
        .select('property_id, platform')
        .eq('sync_enabled', true);

    if (error || !feeds) {
        throw error;
    }

    const results = [];
    for (const feed of feeds) {
        try {
            const result = await syncICalFeed(feed.property_id, feed.platform);
            results.push({ ...feed, ...result });
        } catch (error) {
            results.push({ ...feed, success: false, error });
        }
    }

    return results;
}

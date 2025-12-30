import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: propertyId } = await params;
        const supabase = getServiceSupabase();

        // Get property name
        const { data: property } = await supabase
            .from('properties')
            .select('name')
            .eq('id', propertyId)
            .single();

        if (!property) {
            return new NextResponse('Property not found', { status: 404 });
        }

        // Get all confirmed/pending bookings for this property
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('property_id', propertyId)
            .in('status', ['confirmed', 'pending']);

        if (error) throw error;

        // Generate iCal content
        let icalContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Angelopolis del Mar//NONSGML v1.0//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            `X-WR-CALNAME:${property.name} - Angelopolis`,
        ].join('\r\n') + '\r\n';

        bookings?.forEach((booking) => {
            const checkIn = booking.check_in.replace(/-/g, '');
            const checkOut = booking.check_out.replace(/-/g, '');
            const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

            icalContent += [
                'BEGIN:VEVENT',
                `DTSTAMP:${stamp}`,
                `DTSTART;VALUE=DATE:${checkIn}`,
                `DTEND;VALUE=DATE:${checkOut}`,
                `UID:${booking.id}@angelopolisdelmar.com`,
                `SUMMARY:Reserva - ${booking.guest_name || 'Huésped'}`,
                'END:VEVENT',
            ].join('\r\n') + '\r\n';
        });

        icalContent += 'END:VCALENDAR';

        return new NextResponse(icalContent, {
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Content-Disposition': `attachment; filename="property-${propertyId}.ics"`,
            },
        });
    } catch (error: any) {
        console.error('Error exporting iCal:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

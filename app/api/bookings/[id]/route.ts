import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const { id } = params;

        console.log('Fetching booking with ID:', id);

        // Development mode: return mock booking if Supabase not configured
        const isDevelopmentMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (isDevelopmentMode) {
            // Return mock booking for development
            const mockBooking = {
                id,
                property_id: 'mock-property',
                guest_name: 'Usuario de Prueba',
                guest_email: 'test@example.com',
                check_in: new Date().toISOString(),
                check_out: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                guests: 2,
                total_price: 1500,
                status: 'pending',
                payment_status: 'pending',
            };

            return NextResponse.json({ booking: mockBooking });
        }

        // Production mode: fetch from database
        const { data: booking, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', id)
            .single();

        console.log('Booking fetch result:', { booking, error });

        if (error || !booking) {
            console.error('Booking not found or error:', error);
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ booking });
    } catch (error) {
        console.error('Error fetching booking:', error);
        return NextResponse.json(
            { error: 'Failed to fetch booking' },
            { status: 500 }
        );
    }
}

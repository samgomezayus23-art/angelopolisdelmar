import { NextRequest, NextResponse } from 'next/server';
import { createBooking } from '@/lib/booking-engine';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            propertyId,
            checkIn,
            checkOut,
            guests,
            guestName,
            guestEmail,
            guestPhone,
            specialRequests,
            totalPrice,
        } = body;

        if (!propertyId || !checkIn || !checkOut || !guestName || !guestEmail) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Development mode: if Supabase is not configured, return mock booking
        const isDevelopmentMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (isDevelopmentMode) {
            const mockBooking = {
                id: `mock-booking-${Date.now()}`,
                property_id: propertyId,
                check_in: checkIn,
                check_out: checkOut,
                guests,
                guest_name: guestName,
                guest_email: guestEmail,
                guest_phone: guestPhone,
                special_requests: specialRequests,
                total_price: totalPrice,
                status: 'pending',
                created_at: new Date().toISOString(),
            };

            return NextResponse.json({
                booking: mockBooking,
                developmentMode: true,
                message: 'Mock booking created (development mode)',
            });
        }

        // Production mode: use real database
        const booking = await createBooking({
            propertyId,
            guestName,
            guestEmail,
            guestPhone,
            checkIn,
            checkOut,
            guests: guests || 1, // Default to 1 if not provided
            totalPrice,
            specialRequests,
        });

        // Send confirmation email
        try {
            console.log('Triggering confirmation email for:', guestEmail);
            const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/send-confirmation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: booking.id,
                    guestName,
                    guestEmail,
                    checkIn,
                    checkOut,
                    guests: guests || 1,
                    totalPrice,
                }),
            });

            if (!emailResponse.ok) {
                const errorData = await emailResponse.json();
                console.error('Email API returned error:', errorData);
            } else {
                const result = await emailResponse.json();
                console.log('Email API success:', result);
            }
        } catch (emailError) {
            console.error('Failed to call email API:', emailError);
            // Don't fail the booking if email fails
        }

        return NextResponse.json({ booking });
    } catch (error: any) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create booking' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { bookingId, amount } = body;

        console.log('Creating payment intent for:', { bookingId, amount });

        if (!bookingId || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Verify booking exists
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (bookingError || !booking) {
            console.error('Booking not found:', bookingError);
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            );
        }

        console.log('Booking found, creating Stripe payment intent...');

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'cop', // Colombian Pesos
            metadata: {
                bookingId,
                guestEmail: booking.guest_email,
                guestName: booking.guest_name,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        console.log('Payment intent created:', paymentIntent.id);

        // Update booking with payment intent ID
        await supabase
            .from('bookings')
            .update({ payment_intent_id: paymentIntent.id })
            .eq('id', bookingId);

        // Create payment record
        await supabase.from('payments').insert({
            booking_id: bookingId,
            amount,
            currency: 'COP',
            stripe_payment_intent_id: paymentIntent.id,
            status: 'pending',
        });

        console.log('Payment intent client secret generated successfully');

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error: any) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}

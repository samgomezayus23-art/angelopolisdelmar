import { NextRequest, NextResponse } from 'next/server';
import resend from '@/lib/resend';
import { generateBookingConfirmationEmail } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            bookingId,
            guestName,
            guestEmail,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            propertyName,
        } = body;

        if (!guestEmail || !guestName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Generate email content
        const emailContent = generateBookingConfirmationEmail({
            bookingId,
            guestName,
            guestEmail,
            checkIn,
            checkOut,
            guests,
            totalPrice,
            propertyName,
        });

        // Send email via Resend
        console.log('Attempting to send email via Resend...');
        console.log('To:', guestEmail);
        console.log('From: Angelopolis del Mar <onboarding@resend.dev>');

        const { data, error } = await resend.emails.send({
            from: 'Angelopolis del Mar <onboarding@resend.dev>',
            to: [guestEmail],
            subject: emailContent.subject,
            html: emailContent.html,
        });

        if (error) {
            console.error('Resend API Error:', error);
            return NextResponse.json(
                { error: 'Failed to send email', details: error },
                { status: 500 }
            );
        }

        console.log('Email sent successfully. ID:', data?.id);

        return NextResponse.json({
            success: true,
            emailId: data?.id,
            message: 'Confirmation email sent successfully'
        });
    } catch (error: any) {
        console.error('Critical Error in send-confirmation route:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to send confirmation email' },
            { status: 500 }
        );
    }
}

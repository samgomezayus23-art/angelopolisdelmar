import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability, calculatePrice } from '@/lib/booking-engine';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { propertyId, checkIn, checkOut, promoCode } = body;

        if (!propertyId || !checkIn || !checkOut) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Development mode: if Supabase is not configured, return mock data
        const isDevelopmentMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (isDevelopmentMode) {
            // Calculate days between dates
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

            // Mock pricing based on property ID
            const basePrices: Record<string, number> = {
                '2564495f-9b63-4269-8b2d-6eb77e340a1c': 250,  // ApartaSuite
                'e6fbd744-8d92-47f1-a62c-aaf864ee3692': 600,  // Cabaña
                '5ecbec5e-da1b-4c1f-85b7-a9ca4051085f': 900,  // Casa
                'a7bf9bed-16ee-41a8-81fc-99f9b679f34a': 1200, // Chalet
            };

            const basePrice = basePrices[propertyId] || 250;
            const cleaningFee = 50;
            const subtotal = basePrice * nights;
            const total = subtotal + cleaningFee;

            return NextResponse.json({
                available: true,
                pricing: {
                    nights,
                    basePrice: subtotal,
                    cleaningFee,
                    discount: 0,
                    total,
                },
                developmentMode: true,
            });
        }

        // Production mode: use real database
        console.log('Checking availability for:', { propertyId, checkIn, checkOut });
        const isAvailable = await checkAvailability(propertyId, checkIn, checkOut);
        console.log('Availability result:', isAvailable);

        if (!isAvailable) {
            return NextResponse.json({
                available: false,
                message: 'Property is not available for the selected dates',
            });
        }

        console.log('Calculating price...');
        const pricing = await calculatePrice(propertyId, checkIn, checkOut, promoCode);
        console.log('Pricing result:', pricing);

        return NextResponse.json({
            available: true,
            pricing,
        });
    } catch (error) {
        console.error('Error checking availability:', error);
        return NextResponse.json(
            { error: 'Failed to check availability' },
            { status: 500 }
        );
    }
}

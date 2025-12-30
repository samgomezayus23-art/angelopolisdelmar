import { getServiceSupabase } from './supabase';
import { differenceInDays, eachDayOfInterval, parseISO } from 'date-fns';

export interface AvailabilityCheck {
    propertyId: string;
    checkIn: string;
    checkOut: string;
}

export interface PriceCalculation {
    basePrice: number;
    nights: number;
    cleaningFee: number;
    discount: number;
    total: number;
}

// Property IDs
const PROPERTY_IDS = {
    APARTASUITE: '2564495f-9b63-4269-8b2d-6eb77e340a1c',
    CABANA: 'e6fbd744-8d92-47f1-a62c-aaf864ee3692',
    CASA: '5ecbec5e-da1b-4c1f-85b7-a9ca4051085f',
    CHALET: 'a7bf9bed-16ee-41a8-81fc-99f9b679f34a',
};

// Define conflicting properties map
// Key: Property ID being checked
// Value: Array of Property IDs that, if booked, block the checked property
const CONFLICTING_PROPERTIES: Record<string, string[]> = {
    [PROPERTY_IDS.APARTASUITE]: [PROPERTY_IDS.CHALET],
    [PROPERTY_IDS.CABANA]: [PROPERTY_IDS.CASA, PROPERTY_IDS.CHALET],
    [PROPERTY_IDS.CASA]: [PROPERTY_IDS.CABANA, PROPERTY_IDS.CHALET],
    [PROPERTY_IDS.CHALET]: [PROPERTY_IDS.CABANA, PROPERTY_IDS.CASA, PROPERTY_IDS.APARTASUITE],
};

/**
 * Check if a property is available for the given date range
 */
export async function checkAvailability(
    propertyId: string,
    checkIn: string,
    checkOut: string
): Promise<boolean> {
    try {
        const checkInDate = parseISO(checkIn);
        const checkOutDate = parseISO(checkOut);

        // Get all dates in the range (excluding checkout day)
        const dates = eachDayOfInterval({ start: checkInDate, end: checkOutDate })
            .slice(0, -1)
            .map(date => date.toISOString().split('T')[0]);

        // Determine which properties to check (the property itself + conflicting ones)
        const propertiesToCheck = [propertyId, ...(CONFLICTING_PROPERTIES[propertyId] || [])];

        // Check for existing bookings that overlap in ANY of the conflicting properties
        const supabase = getServiceSupabase();
        const { data: overlappingBookings, error: bookingError } = await supabase
            .from('bookings')
            .select('id, property_id')
            .in('property_id', propertiesToCheck)
            .in('status', ['confirmed', 'pending'])
            .lt('check_in', checkOut)
            .gt('check_out', checkIn);

        // If table doesn't exist, assume available
        if (bookingError) {
            console.error('Booking check error:', bookingError);
            // If it's a "relation does not exist" error, tables aren't set up yet
            if (bookingError.message?.includes('relation') || bookingError.message?.includes('does not exist')) {
                console.log('Bookings table not found, assuming available');
                return true;
            }
            throw bookingError;
        }

        if (overlappingBookings && overlappingBookings.length > 0) {
            console.log(`Conflict found! Property ${propertyId} blocked by booking in property:`, overlappingBookings[0].property_id);
            return false;
        }

        // Check availability table for blocked dates (only for the specific property)
        // Note: Manual blocks usually apply only to the specific property, 
        // unless we want manual blocks to also cascade, but for now let's keep it simple.
        const { data: blockedDates, error: availError } = await getServiceSupabase()
            .from('availability')
            .select('date')
            .eq('property_id', propertyId)
            .eq('is_available', false)
            .in('date', dates);

        // If table doesn't exist, assume available
        if (availError) {
            console.error('Availability check error:', availError);
            if (availError.message?.includes('relation') || availError.message?.includes('does not exist')) {
                console.log('Availability table not found, assuming available');
                return true;
            }
            throw availError;
        }

        if (blockedDates && blockedDates.length > 0) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in checkAvailability:', error);
        throw error;
    }
}

/**
 * Calculate the total price for a booking
 */
export async function calculatePrice(
    propertyId: string,
    checkIn: string,
    checkOut: string,
    promoCode?: string
): Promise<PriceCalculation> {
    const checkInDate = parseISO(checkIn);
    const checkOutDate = parseISO(checkOut);
    const nights = differenceInDays(checkOutDate, checkInDate);

    // Get property base price and cleaning fee
    const { data: property, error: propError } = await getServiceSupabase()
        .from('properties')
        .select('base_price, cleaning_fee')
        .eq('id', propertyId)
        .single();

    if (propError || !property) throw new Error('Property not found');

    let basePrice = Number(property.base_price) * nights;
    const cleaningFee = Number(property.cleaning_fee) || 0;
    let discount = 0;

    // Check for price overrides in availability table
    const dates = eachDayOfInterval({ start: checkInDate, end: checkOutDate })
        .slice(0, -1)
        .map(date => date.toISOString().split('T')[0]);

    const { data: priceOverrides } = await getServiceSupabase()
        .from('availability')
        .select('date, price_override')
        .eq('property_id', propertyId)
        .in('date', dates)
        .not('price_override', 'is', null);

    if (priceOverrides && priceOverrides.length > 0) {
        // Calculate with overrides
        basePrice = 0;
        const overrideMap = new Map(
            priceOverrides.map(po => [po.date, Number(po.price_override)])
        );

        dates.forEach(date => {
            basePrice += overrideMap.get(date) || Number(property.base_price);
        });
    }

    // Apply promo code if provided
    if (promoCode) {
        const { data: promo } = await getServiceSupabase()
            .from('promotions')
            .select('*')
            .eq('code', promoCode.toUpperCase())
            .eq('is_active', true)
            .single();

        if (promo) {
            const now = new Date();
            const validFrom = promo.valid_from ? parseISO(promo.valid_from) : null;
            const validUntil = promo.valid_until ? parseISO(promo.valid_until) : null;

            const isValid =
                (!validFrom || now >= validFrom) &&
                (!validUntil || now <= validUntil) &&
                (!promo.min_nights || nights >= promo.min_nights) &&
                (!promo.max_uses || promo.current_uses < promo.max_uses);

            if (isValid) {
                if (promo.discount_type === 'percentage') {
                    discount = (basePrice * Number(promo.discount_value)) / 100;
                } else {
                    discount = Number(promo.discount_value);
                }
            }
        }
    }

    const total = basePrice + cleaningFee - discount;

    return {
        basePrice,
        nights,
        cleaningFee,
        discount,
        total,
    };
}

/**
 * Create a booking with conflict prevention
 */
export async function createBooking(bookingData: {
    propertyId: string;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    specialRequests?: string;
    promoCode?: string;
}) {
    // Double-check availability before creating
    const isAvailable = await checkAvailability(
        bookingData.propertyId,
        bookingData.checkIn,
        bookingData.checkOut
    );

    if (!isAvailable) {
        throw new Error('Property is not available for the selected dates');
    }

    // Create the booking
    const { data, error } = await getServiceSupabase()
        .from('bookings')
        .insert({
            property_id: bookingData.propertyId,
            guest_name: bookingData.guestName,
            guest_email: bookingData.guestEmail,
            guest_phone: bookingData.guestPhone,
            check_in: bookingData.checkIn,
            check_out: bookingData.checkOut,
            guests_count: bookingData.guests, // Changed from guests to guests_count
            total_price: bookingData.totalPrice,
            special_requests: bookingData.specialRequests,
            status: 'pending',
            payment_status: 'pending',
        })
        .select()
        .single();

    if (error) throw error;

    // Update promo code usage if applicable
    if (bookingData.promoCode) {
        await getServiceSupabase().rpc('increment_promo_usage', {
            promo_code: bookingData.promoCode.toUpperCase(),
        });
    }

    return data;
}

/**
 * Get all booked dates for a property to show a calendar view or let the bot "read" the calendar
 */
export async function getBookedDates(propertyId: string) {
    try {
        const propertiesToCheck = [propertyId, ...(CONFLICTING_PROPERTIES[propertyId] || [])];
        const supabase = getServiceSupabase();

        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('check_in, check_out, source, property_id')
            .in('property_id', propertiesToCheck)
            .in('status', ['confirmed', 'pending'])
            .gte('check_out', new Date().toISOString().split('T')[0]);

        if (error) throw error;

        return bookings || [];
    } catch (error) {
        console.error('Error in getBookedDates:', error);
        throw error;
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { parseISO } from 'date-fns';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, nights } = body;

        if (!code) {
            return NextResponse.json(
                { error: 'Promo code is required' },
                { status: 400 }
            );
        }

        const { data: promo, error } = await supabase
            .from('promotions')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('is_active', true)
            .single();

        if (error || !promo) {
            return NextResponse.json(
                { valid: false, message: 'Invalid promo code' },
                { status: 200 }
            );
        }

        const now = new Date();
        const validFrom = promo.valid_from ? parseISO(promo.valid_from) : null;
        const validUntil = promo.valid_until ? parseISO(promo.valid_until) : null;

        // Check validity conditions
        const isExpired = validUntil && now > validUntil;
        const notYetValid = validFrom && now < validFrom;
        const minNightsNotMet = promo.min_nights && nights && nights < promo.min_nights;
        const maxUsesReached = promo.max_uses && promo.current_uses >= promo.max_uses;

        if (isExpired) {
            return NextResponse.json({
                valid: false,
                message: 'This promo code has expired',
            });
        }

        if (notYetValid) {
            return NextResponse.json({
                valid: false,
                message: 'This promo code is not yet valid',
            });
        }

        if (minNightsNotMet) {
            return NextResponse.json({
                valid: false,
                message: `This promo code requires a minimum of ${promo.min_nights} nights`,
            });
        }

        if (maxUsesReached) {
            return NextResponse.json({
                valid: false,
                message: 'This promo code has reached its maximum usage limit',
            });
        }

        return NextResponse.json({
            valid: true,
            promo: {
                code: promo.code,
                description: promo.description,
                discountType: promo.discount_type,
                discountValue: promo.discount_value,
            },
        });
    } catch (error) {
        console.error('Error validating promo code:', error);
        return NextResponse.json(
            { error: 'Failed to validate promo code' },
            { status: 500 }
        );
    }
}

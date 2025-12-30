import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city');
        const maxGuests = searchParams.get('maxGuests');
        const isActive = searchParams.get('isActive') !== 'false';

        let query = supabase
            .from('properties')
            .select('*')
            .eq('is_active', isActive);

        if (city) {
            query = query.eq('city', city);
        }

        if (maxGuests) {
            query = query.gte('max_guests', parseInt(maxGuests));
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ properties: data });
    } catch (error) {
        console.error('Error fetching properties:', error);
        return NextResponse.json(
            { error: 'Failed to fetch properties' },
            { status: 500 }
        );
    }
}

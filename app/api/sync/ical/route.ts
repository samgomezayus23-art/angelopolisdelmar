import { NextRequest, NextResponse } from 'next/server';
import { syncICalFeed, syncAllFeeds } from '@/lib/ical-sync';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { propertyId, platform, syncAll } = body;

        if (syncAll) {
            // Sync all configured feeds
            const results = await syncAllFeeds();
            return NextResponse.json({ results });
        }

        if (!propertyId || !platform) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Sync specific feed
        const result = await syncICalFeed(propertyId, platform);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error syncing iCal:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to sync iCal feed' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';

export async function GET() {
    const envVars = {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 5)}...` : 'MISSING',
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'PRESENT' : 'MISSING',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'PRESENT' : 'MISSING',
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'PRESENT' : 'MISSING',
        RESEND_API_KEY: process.env.RESEND_API_KEY ? 'PRESENT' : 'MISSING',
        NODE_ENV: process.env.NODE_ENV,
    };

    return NextResponse.json(envVars);
}

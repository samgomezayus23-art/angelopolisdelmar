import { NextResponse } from 'next/server';

export async function GET() {
    const envVars = {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'CONFIGURED (Starts with ' + process.env.GEMINI_API_KEY.substring(0, 4) + '...)' : 'MISSING',
        SUPABASE_URL: process.env.SUPABASE_URL ? 'CONFIGURED' : 'MISSING',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'CONFIGURED' : 'MISSING',
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL || 'NO',
        PORT: process.env.PORT || '3000',
        CWD: process.cwd(),
        VERSION: '6.0'
    };

    return NextResponse.json(envVars);
}

import { NextResponse } from 'next/server';

export async function GET() {
    const buildTimestamp = "2025-12-30 13:45 (v3.2)";
    const envVars = {
        STATUS: "DIAGNOSTIC_ACTIVE",
        BUILD: buildTimestamp,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "Presente" : "FALTANTE",
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Presente" : "FALTANTE",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Presente" : "FALTANTE",
        ENVIRONMENT: process.env.NODE_ENV || "unknown",
        NODE_VERSION: process.version,
        AVAILABLE_KEYS: Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')).slice(0, 10),
        PATH_CWD: process.cwd()
    };

    return NextResponse.json(envVars);
}

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const path = require('path')

// Load environment variables using dotenv
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.error('> Error loading .env file:', result.error);
} else {
    console.log('> .env file loaded successfully');
}

// Diagnostic: Check critical environment variables (obfuscated)
const checkEnv = (key) => {
    const val = process.env[key];
    if (!val) {
        console.warn(`> WARNING: ${key} is NOT defined in process.env`);
    } else {
        const masked = val.length > 8 
            ? `${val.substring(0, 4)}...${val.substring(val.length - 4)}` 
            : '***';
        console.log(`> FOUND: ${key} (${masked})`);
    }
}

console.log('> --- Environment Diagnostic ---');
checkEnv('GEMINI_API_KEY');
checkEnv('SUPABASE_URL');
console.log('> ------------------------------');

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true)
            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })
        .once('error', (err) => {
            console.error(err)
            process.exit(1)
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port} (v3.2)`)
        })
})

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Manual .env loader (No 'dotenv' dependency needed)
const loadEnv = () => {
    console.log('> (V6.0) Initializing Environment...');
    console.log(`> Current Working Directory: ${process.cwd()}`);

    try {
        const potentialPaths = [
            path.resolve(process.cwd(), '.env'),
            path.resolve(__dirname, '.env'),
            '/home/u294564469/domains/lightsteelblue-wren-646415.hostingersite.com/public_html/.env',
            '/home/customer/www/lightsteelblue-wren-646415.hostingersite.com/.env',
            './.env'
        ];

        let loaded = false;
        for (const envPath of potentialPaths) {
            if (fs.existsSync(envPath)) {
                console.log(`> (V6.0) Found .env at: ${envPath}`);
                const envConfig = fs.readFileSync(envPath, 'utf8');
                envConfig.split('\n').forEach(line => {
                    const parts = line.split('=');
                    if (parts.length >= 2) {
                        const key = parts[0].trim();
                        const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
                        if (!process.env[key] && key.length > 0 && !key.startsWith('#')) {
                            process.env[key] = val;
                        }
                    }
                });
                loaded = true;
                break;
            }
        }

        if (!loaded) {
            console.error('> (V6.0) WARNING: No .env file found in any searched location.');
        }
    } catch (e) {
        console.error('> Error loading .env:', e);
    }
};

loadEnv();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Diagnostic Log
console.log('> --- Server V6.0 Starting ---');
console.log(`> GEMINI_API_KEY status: ${process.env.GEMINI_API_KEY ? 'DETECTED' : 'NOT FOUND'}`);

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            const { pathname } = parsedUrl;

            // Intercept functionality for Chatbot
            if (req.method === 'POST' && pathname === '/api/chat') {
                console.log('> Intercepting /api/chat (V6.0)');

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
                res.setHeader('Content-Type', 'application/json');

                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                req.on('end', async () => {
                    try {
                        const { message } = JSON.parse(body);
                        const apiKey = process.env.GEMINI_API_KEY;

                        if (!apiKey || apiKey.length < 10) {
                            console.error('> Missing API Key in V6.0');
                            res.statusCode = 500;
                            res.end(JSON.stringify({
                                response: `Error V6.0: Servidor no detecta API Key. (Status: ${apiKey ? 'Deformada/Corta' : 'Nula/Faltante'}). Verifica .env en la raíz.`
                            }));
                            return;
                        }

                        const genAI = new GoogleGenerativeAI(apiKey);
                        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                        const result = await model.generateContent(message);
                        const responseText = result.response.text();

                        res.statusCode = 200;
                        res.end(JSON.stringify({ response: responseText }));

                    } catch (error) {
                        console.error('> Chat Error V6.0:', error);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ response: "Error del servidor V6.0 (Revisar logs de Hostinger)." }));
                    }
                });
                return;
            }

            // Let Next.js handle everything else
            await handle(req, res, parsedUrl);

        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    })
        .once('error', (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port} (V6.0 Native)`);
        });
});

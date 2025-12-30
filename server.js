const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables using dotenv
const dotenv = require('dotenv');
dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const server = express();
server.use(cors());
server.use(express.json());

// Diagnostic: Check critical environment variables
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

console.log('> --- Environment Diagnostic (V4.2) ---');
checkEnv('GEMINI_API_KEY');
checkEnv('SUPABASE_URL');
console.log('> ------------------------------');

// Direct API Route for Chatbot (Bypasses Next.js build issues)
server.post('/api/chat', async (req, res) => {
    console.log('> Incoming Chat Request (Express V4.2)');
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey.length < 10) {
            return res.status(500).json({
                response: 'Error de Configuración (V4.2): El servidor no detecta la API Key. Verifica el archivo .env.'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(message);
        const responseText = result.response.text();

        res.json({ response: responseText });
    } catch (error) {
        console.error('> Chat Error:', error);
        res.status(500).json({ response: "Lo siento, hubo un error conectando con el asistente." });
    }
});

app.prepare().then(() => {
    // Handle everything else with Next.js
    server.all('*', (req, res) => {
        const parsedUrl = parse(req.url, true);
        return handle(req, res, parsedUrl);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${hostname}:${port} (V4.2 Express)`);
    });
});

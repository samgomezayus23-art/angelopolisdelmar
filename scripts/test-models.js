const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // We just want to access the API, but the SDK doesn't have a direct listModels method exposed easily on the main class in all versions, 
        // but usually we can try to just run a simple prompt on a likely model or check documentation.
        // Actually, for this SDK version, we might not have a listModels helper directly on genAI instance in the simplified usage.
        // Let's try to use the model we think exists and catch the error, or use a known stable one.

        // However, the error message suggested calling ListModels. 
        // Let's try to use the fetch directly if the SDK doesn't make it obvious, 
        // OR just try 'gemini-1.0-pro' which is the older stable name.

        console.log("Trying gemini-1.0-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await modelPro.generateContent("Hello");
        console.log("gemini-1.0-pro works!");
        console.log(result.response.text());
    } catch (error) {
        console.error("Error with gemini-1.0-pro:", error.message);

        try {
            console.log("Trying gemini-1.5-flash-latest...");
            const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const result = await modelFlash.generateContent("Hello");
            console.log("gemini-1.5-flash-latest works!");
        } catch (err) {
            console.error("Error with gemini-1.5-flash-latest:", err.message);
        }
    }
}

listModels();

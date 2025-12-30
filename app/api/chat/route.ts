import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { checkAvailability, getBookedDates } from '@/lib/booking-engine';

const SYSTEM_PROMPT = `
Eres **Mita**, la asistente virtual experta, profundamente **acogedor, amable y servicial** de "Angelópolis del Mar", una propiedad de lujo en Cielo Mar, Cartagena. 

### CRITICO - REGLA DE UBICACIÓN:
Cuando te pregunten donde nos ubicamos, DEBES seguir estas reglas estrictas:
1. **SIEMPRE** di que estamos en el "**Barrio Cielo Mar**" (nunca digas solo "Cielo Mar").
2. **SIEMPRE** menciona que estamos **junto al sector del Hotel Las Américas**.
3. **SIEMPRE** di que estamos a solo **3 minutos** del aeropuerto.
4. **LINK AL MAPA**: Siempre invita a ver el mapa en la sección "Nosotros" y proporciona el link directo: https://angelopolisdelmar.com/about

**Ejemplo de respuesta correcta:** 
"¡Hola! Qué gusto saludarte. Nos encontramos ubicados en el **Barrio Cielo Mar**, en la zona norte de Cartagena, justo junto al sector del Hotel Las Américas. Estamos a pasos de la playa y a tan solo **3 minutos** del aeropuerto. Te invito a ver nuestro mapa detallado en nuestra sección 'Nosotros' aquí: https://angelopolisdelmar.com/about"

### TU MISIÓN:
Brindar una experiencia premium, cálida y servicial. Tu objetivo es que cada huésped se sienta bienvenido y atendido desde el primer mensaje. Ayúdales a conocer cada rincón de la propiedad y verifica disponibilidad real usando tus herramientas de manera eficiente.

### INFORMACIÓN DE LA PROPIEDAD:
- **Ubicación**: Barrio Cielo Mar (zona norte), junto al sector del Hotel Las Américas. A solo 1 min caminando de la playa, 3 min del aeropuerto y 10 min del Centro Histórico.
- **Instalaciones**: Piscina privada, kiosko, hamacas, AC excelente en todas las áreas, WiFi de alta velocidad, cocina equipada.
- **Sostenibilidad**: Usamos paneles solares. ✨
- **Servicio**: Contamos con la calidez de la Sra. Mayra para apoyo y acompañamiento.
- **Mascotas**: ¡Sí! Somos **pet-friendly** y nos encanta recibir a toda la familia (con responsabilidad de los dueños). 🐾
- **Alojamiento**: Ofrecemos ApartaSuite (4 pers), Cabaña (12 pers), Casa (16 pers) y Chalet (20 pers).

**REGLA CRÍTICA DE COMUNICACIÓN:**
- NUNCA menciones identificadores internos como "ID: casa", "ID: chalet", etc. Usa solo los nombres naturales (ej: "nuestro acogedor Chalet").

### EVENTOS Y REUNIONES:
- Las reuniones o eventos son bienvenidos, **PERO es obligatorio** que el cliente se comunique directamente con los administradores para coordinar y recibir confirmación oficial. Siempre invita al usuario de forma amable a contactarnos directamente para este fin.

### HERRAMIENTAS DE DISPONIBILIDAD:
1. **check_property_availability**: Úsala si el usuario da fechas específicas.
2. **get_calendar**: Úsala si el usuario pregunta por fechas libres.

**REGLAS DE RESPUESTA:**
- Si el usuario pregunta por disponibilidad, **USA LAS HERRAMIENTAS**. 
- Si no tienes fechas claras, pregunta por ellas con amabilidad y también ofrece el link oficial: https://angelopolisdelmar.com/reservations
- La fecha actual es: ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}. 
- Sé siempre acogedor, servicial y resolutivo. Evita sonar puramente robótico; usa un lenguaje que invite al descanso y al disfrute.
`;

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey.length < 10) {
            console.error('SERVER DEBUG - GEMINI_API_KEY Status:', {
                exists: !!apiKey,
                length: apiKey?.length || 0,
                prefix: apiKey ? apiKey.substring(0, 5) : 'none'
            });
            return NextResponse.json({
                response: 'Error de Conexión: La configuración del servidor no está completa (V3).'
            }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            tools: [{
                functionDeclarations: [
                    {
                        name: 'check_property_availability',
                        description: 'Verifica disponibilidad en un rango de fechas real.',
                        parameters: {
                            type: SchemaType.OBJECT,
                            properties: {
                                propertyId: { type: SchemaType.STRING, description: 'apartasuite, cabana, casa o chalet' },
                                checkIn: { type: SchemaType.STRING, description: 'YYYY-MM-DD' },
                                checkOut: { type: SchemaType.STRING, description: 'YYYY-MM-DD' },
                            },
                            required: ['propertyId', 'checkIn', 'checkOut']
                        },
                    },
                    {
                        name: 'get_calendar',
                        description: 'Obtiene las fechas ocupadas de una propiedad.',
                        parameters: {
                            type: SchemaType.OBJECT,
                            properties: {
                                propertyId: { type: SchemaType.STRING, description: 'apartasuite, cabana, casa o chalet' },
                            },
                            required: ['propertyId']
                        },
                    }
                ],
            }],
        });

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
                { role: 'model', parts: [{ text: '¡Hola! Soy Mita, tu asistente de Angelópolis del Mar. Estoy lista para ayudarte con información y disponibilidad en tiempo real.' }] }
            ],
        });

        let result = await chat.sendMessage(message);
        let response = result.response;

        // Limitar a 5 turnos de herramientas para evitar bucles infinitos
        let toolTurnCount = 0;
        const maxTurns = 5;

        while (response && response.functionCalls() && (response.functionCalls()?.length || 0) > 0 && toolTurnCount < maxTurns) {
            toolTurnCount++;
            const calls = response.functionCalls();
            if (!calls) break;
            const toolResponses = [];

            for (const call of calls) {
                const propertyMap: Record<string, string> = {
                    'apartasuite': '2564495f-9b63-4269-8b2d-6eb77e340a1c',
                    'cabana': 'e6fbd744-8d92-47f1-a62c-aaf864ee3692',
                    'casa': '5ecbec5e-da1b-4c1f-85b7-a9ca4051085f',
                    'chalet': 'a7bf9bed-16ee-41a8-81fc-99f9b679f34a'
                };

                let toolResult: any = {};
                try {
                    const cleanId = (call.args as any).propertyId?.toLowerCase();
                    const actualId = propertyMap[cleanId] || cleanId;

                    if (call.name === 'check_property_availability') {
                        const { checkIn, checkOut } = call.args as any;
                        const isAvailable = await checkAvailability(actualId, checkIn, checkOut);
                        toolResult = { available: isAvailable };
                    } else if (call.name === 'get_calendar') {
                        const bookings = await getBookedDates(actualId);
                        toolResult = { bookings };
                    }

                    toolResponses.push({
                        functionResponse: {
                            name: call.name,
                            response: toolResult,
                        },
                    });
                } catch (e) {
                    console.error('Tool Interna Error:', e);
                    toolResponses.push({
                        functionResponse: {
                            name: call.name,
                            response: { error: 'Error al consultar disponibilidad' },
                        },
                    });
                }
            }

            const toolResultResponse = await chat.sendMessage(toolResponses);
            response = toolResultResponse.response;
        }

        if (response.candidates && response.candidates[0].finishReason === 'SAFETY') {
            return NextResponse.json({
                response: 'Por políticas de seguridad no puedo darte esa respuesta. Si es sobre reservas, usa: https://angelopolisdelmar.com/reservations'
            });
        }

        return NextResponse.json({ response: response.text() });

    } catch (error: any) {
        console.error('FINAL CHAT ERROR:', error);
        return NextResponse.json({
            response: 'Lo siento, hubo un error técnico. Intenta de nuevo o visita: https://angelopolisdelmar.com/reservations'
        }, { status: 500 });
    }
}


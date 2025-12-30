const { checkAvailability } = require('./lib/booking-engine');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function test() {
    const propertyId = '2564495f-9b63-4269-8b2d-6eb77e340a1c'; // ApartaSuite
    const checkIn = '2025-12-18';
    const checkOut = '2025-12-20';

    console.log(`Checking availability for ${propertyId} from ${checkIn} to ${checkOut}...`);
    try {
        const isAvailable = await checkAvailability(propertyId, checkIn, checkOut);
        console.log('Result:', isAvailable ? 'AVAILABLE' : 'BLOCKED');
    } catch (error) {
        console.error('Error:', error);
    }
}

test();

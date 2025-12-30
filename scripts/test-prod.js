
async function testProduction() {
    console.log('Testing production API at Netlify...');
    try {
        const response = await fetch('https://effortless-twilight-3f9607.netlify.app/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Hola, ¿aceptan mascotas?' })
        });
        const data = await response.json();
        console.log('Production Response:', data);
    } catch (error) {
        console.error('Production Error:', error);
    }
}
testProduction();

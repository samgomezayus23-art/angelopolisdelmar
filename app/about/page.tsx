import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="about-page container">
            <h1 className="page-title">Sobre Nosotros</h1>

            <div className="about-content">
                <div className="about-text">
                    <p>
                        En Angelópolis del Mar creemos que las mejores vacaciones son las que se sienten como en casa,
                        pero con todos los extras de un descanso en el Caribe. Por eso creamos una casa amplia y acogedora,
                        pensada para que familias y grupos de amigos puedan reunirse, relajarse y disfrutar sin prisas.
                    </p>
                    <p>
                        Estamos ubicados en Cielo Mar, un barrio residencial tranquilo de la zona norte, a un paso de la playa,
                        a pocos minutos del aeropuerto y a solo 10 minutos del Centro Histórico. Aquí tienes piscina privada, kiosko, hamacas, zonas verdes y áreas
                        sociales al aire libre, ideales para compartir una comida, conversar o simplemente descansar con la brisa.
                    </p>
                    <p>
                        Cuidamos los detalles para que tu estadía sea cómoda y sencilla: cocina equipada, WiFi, habitaciones
                        frescas y acompañamiento durante tu estadía. Además, contamos con paneles solares para minimizar el consumo ambiental y promover un turismo más sostenible. Nuestro objetivo es que, cuando pienses en volver a la ciudad,
                        sientas que en Angelópolis del Mar tienes tu propia casa esperándote.
                    </p>
                </div>
                <div className="about-image-container" style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                    <Image
                        src="/about-image.jpg"
                        alt="Angelópolis del Mar"
                        width={1000}
                        height={1000}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        priority
                    />
                </div>
            </div>

            {/* Location Section */}
            <section className="location-section">
                <h2 className="section-title">Nuestra Ubicación</h2>
                <p className="section-subtitle">En el exclusivo sector de Cielo Mar</p>
                <div className="map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.5786358872656!2d-75.508333!3d10.455556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ef6255555555555%3A0x5555555555555555!2sCielo+Mar%2C+Cartagena+de+Indias%2C+Provincia+de+Cartagena%2C+Bol%C3%ADvar!5e0!3m2!1ses!2sco!4v1625000000000!5m2!1ses!2sco"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación Angelopolis del Mar"
                    ></iframe>
                </div>
            </section>
        </div>
    );
}

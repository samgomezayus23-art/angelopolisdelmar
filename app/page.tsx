import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="welcome-page">
      {/* Hero Section */}
      <section className="hero-fullscreen">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
        >
          <source src="/videos/recorte piscina principal.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="hero-content-welcome">
          <h1 className="welcome-title">Bienvenidos a Angelopolis del Mar</h1>
          <p className="welcome-subtitle">
            Aquí las vacaciones se viven sin prisas
          </p>
          <Link href="/reservations" className="btn-primary-large">
            Reservar Ahora
          </Link>
        </div>
      </section>

      {/* General Details Section */}
      <section className="details-section container">
        <div className="details-grid">
          <div className="detail-item">
            <h3>A un paso de la playa</h3>
            <p>En Cielo Mar, muy cerca del mar, a pocos minutos del aeropuerto y a solo 10 minutos del Centro Histórico.</p>
          </div>
          <div className="detail-item">
            <h3>Piscina y zonas al aire libre</h3>
            <p>Piscina privada, kiosko, hamacas y jardín para disfrutar y relajarte.</p>
          </div>
          <div className="detail-item">
            <h3>Casa ideal para familias y grupos</h3>
            <p>Espacios amplios, varias habitaciones y áreas sociales para estar todos cómodos.</p>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="testimonials-section container">
        <h2 className="section-title">Lo que dicen nuestros huéspedes</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">"Súper volvería una y mil veces!!!❤ señora Mayra una buena y cariñosa persona siempre dispuesta, servicial y amable."</p>
            <p className="testimonial-author">- Pao Mondol</p>
            <p className="testimonial-source">Reseña extraída de Google</p>
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">"Exelente apto buena ubicacion demasiado comodo todo muy bueno le doy 10 de 10 muy recomendado"</p>
            <p className="testimonial-author">- Erika Maria Ospina Pineda</p>
            <p className="testimonial-source">Reseña extraída de Google</p>
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">"Es un muy lindo lugar, muy acogedor, la señora de la casa muy amable . Estan pendientes de lo que necesitamos, la casa es super, el aire acondicionado exelente, se siente fresca la casa. Ademas esta cerca del aeropuerto en una excelente ubicación y hay una playa muy tranquila al frente. La verdad es un exelente lugar y lo recomiendo muchisimo."</p>
            <p className="testimonial-author">- Majuna Rodriguez</p>
            <p className="testimonial-source">Reseña extraída de Google</p>
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
          </div>
        </div>
      </section>

    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import ChatWidget from '@/components/ChatWidget';
import './globals.css';

export const metadata = {
  title: 'Cartagena Tourist Rentals - Alquiler Vacacional',
  description: 'Encuentra tu alojamiento perfecto en Cartagena',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <nav className="navbar">
          <div className="container">
            <div className="nav-left">
              <Link href="/" className="logo">
                <div style={{ position: 'relative', width: '250px', height: '80px' }}>
                  <Image
                    src="/Angelopolis_logo.png"
                    alt="Angelopolis Logo"
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'left' }}
                    priority
                  />
                </div>
              </Link>
            </div>

            <div className="nav-center">
              <div className="nav-links">
                <Link href="/">Inicio</Link>
                <Link href="/gallery">Galería</Link>
                <Link href="/reservations">Reservas</Link>
                <Link href="/about">Nosotros</Link>
              </div>
            </div>

            <div className="nav-right">
              <div className="social-icons">
                <a href="https://www.facebook.com/angelopolisdelmar/?locale=es_LA" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://www.instagram.com/angelopolisdelmar/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://share.google/KN2EuQzfsMpGsS0QR" target="_blank" rel="noopener noreferrer" aria-label="Google Reviews">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.053-1.147 7.92-3.067 1.947-1.933 2.56-4.8 2.56-7.293 0-.693-.053-1.36-.173-2.053H12.48z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <ChatWidget />
        <footer className="footer">
          <div className="container">
            <p>&copy; 2024 Cartagena Tourist Rentals. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

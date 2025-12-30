'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('id');
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (bookingId) {
            fetch(`/api/bookings/${bookingId}`)
                .then((res) => res.json())
                .then((data) => {
                    setBooking(data.booking);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [bookingId]);

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!booking) {
        return <div className="error">Reserva no encontrada</div>;
    }

    return (
        <div className="confirmation-page container">
            <div className="confirmation-card">
                <div className="success-icon">✓</div>
                <h1>¡Reserva Confirmada!</h1>
                <p className="confirmation-message">
                    Gracias por tu reserva. Hemos enviado un correo de confirmación a <strong>{booking.guest_email}</strong>
                </p>

                <div className="booking-details">
                    <h2>Detalles de tu Reserva</h2>
                    <div className="detail-row">
                        <span>ID de Reserva:</span>
                        <span><strong>{booking.id}</strong></span>
                    </div>
                    <div className="detail-row">
                        <span>Huésped:</span>
                        <span>{booking.guest_name}</span>
                    </div>
                    <div className="detail-row">
                        <span>Check-in:</span>
                        <span>{new Date(booking.check_in).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    <div className="detail-row">
                        <span>Check-out:</span>
                        <span>{new Date(booking.check_out).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    <div className="detail-row">
                        <span>Huéspedes:</span>
                        <span>{booking.guests_count || booking.guests}</span>
                    </div>
                    <div className="detail-row total">
                        <span>Total Pagado:</span>
                        <span><strong>COP$ {Number(booking.total_price).toLocaleString('es-CO')}</strong></span>
                    </div>
                </div>

                <div className="confirmation-actions">
                    <Link href="/" className="btn-primary-large">
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function BookingConfirmationPage() {
    return (
        <Suspense fallback={<div className="loading">Cargando...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}

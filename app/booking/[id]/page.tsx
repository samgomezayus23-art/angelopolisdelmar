'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '@/components/PaymentForm';
import { use } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BookingCheckoutPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const [booking, setBooking] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch booking details
        fetch(`/api/bookings/${resolvedParams.id}`)
            .then((res) => res.json())
            .then((data) => {
                setBooking(data.booking);

                // Create payment intent
                return fetch('/api/payments/create-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        bookingId: data.booking.id,
                        amount: data.booking.total_price
                    }),
                });
            })
            .then((res) => res.json())
            .then((data) => {
                setClientSecret(data.clientSecret);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, [resolvedParams.id]);

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!booking) {
        return <div className="error">Reserva no encontrada</div>;
    }

    const options = {
        clientSecret,
    };

    return (
        <div className="booking-checkout-page">
            <div className="container">
                <h1>Completar Reserva</h1>

                <div className="checkout-grid">
                    {/* Booking Summary */}
                    <div className="booking-summary">
                        <h2>Resumen de Reserva</h2>
                        <div className="summary-item">
                            <span>Huésped:</span>
                            <span>{booking.guest_name}</span>
                        </div>
                        <div className="summary-item">
                            <span>Check-in:</span>
                            <span>{new Date(booking.check_in).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="summary-item">
                            <span>Check-out:</span>
                            <span>{new Date(booking.check_out).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="summary-item">
                            <span>Huéspedes:</span>
                            <span>{booking.guests_count || booking.guests}</span>
                        </div>
                        <div className="summary-item total">
                            <span>Total:</span>
                            <span>COP$ {Number(booking.total_price).toLocaleString('es-CO')}</span>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="payment-section">
                        <h2>Información de Pago</h2>
                        {clientSecret ? (
                            <Elements stripe={stripePromise} options={options}>
                                <PaymentForm
                                    bookingId={booking.id}
                                    amount={booking.total_price}
                                    onPaymentSuccess={() => {
                                        window.location.href = `/booking/confirmation?id=${booking.id}`;
                                    }}
                                />
                            </Elements>
                        ) : (
                            <div>Preparando pago...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface BookingFormProps {
    propertyId: string;
    basePrice: number;
    onBookingComplete?: (bookingId: string) => void;
}

interface BookingFormData {
    checkIn: string;
    checkOut: string;
    guests: number;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    specialRequests: string;
    promoCode: string;
}

export default function BookingForm({
    propertyId,
    basePrice,
    onBookingComplete,
}: BookingFormProps) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>();
    const [pricing, setPricing] = useState<any>(null);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [availabilityMessage, setAvailabilityMessage] = useState('');

    const checkIn = watch('checkIn');
    const checkOut = watch('checkOut');
    const promoCode = watch('promoCode');

    const checkAvailability = async () => {
        if (!checkIn || !checkOut) return;

        setIsCheckingAvailability(true);
        try {
            const response = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ propertyId, checkIn, checkOut, promoCode }),
            });

            const data = await response.json();

            if (data.available) {
                setPricing(data.pricing);
                setAvailabilityMessage('✓ Disponible');
            } else {
                setPricing(null);
                setAvailabilityMessage('✗ No disponible para estas fechas');
            }
        } catch (error) {
            setAvailabilityMessage('Error al verificar disponibilidad');
        } finally {
            setIsCheckingAvailability(false);
        }
    };

    const onSubmit = async (data: BookingFormData) => {
        console.log('Form submitted with data:', data);
        console.log('Pricing:', pricing);

        if (!pricing) {
            alert('Por favor verifica la disponibilidad primero');
            return;
        }

        try {
            console.log('Creating booking...');
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    propertyId,
                    ...data,
                    totalPrice: pricing.total,
                }),
            });

            const result = await response.json();
            console.log('Booking result:', result);

            if (result.booking) {
                console.log('Redirecting to payment page with booking ID:', result.booking.id);
                onBookingComplete?.(result.booking.id);
            } else {
                alert('Error: No se pudo crear la reserva');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Error al crear la reserva');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="booking-form">
            <h3>Reserva tu estadía</h3>

            <div className="form-group">
                <label>Check-in</label>
                <input
                    type="date"
                    {...register('checkIn', { required: true })}
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className="form-group">
                <label>Check-out</label>
                <input
                    type="date"
                    {...register('checkOut', { required: true })}
                    min={checkIn}
                />
            </div>

            <div className="form-group">
                <label>Huéspedes</label>
                <input
                    type="number"
                    {...register('guests', { required: true, min: 1 })}
                    min="1"
                />
            </div>

            <button
                type="button"
                onClick={checkAvailability}
                disabled={!checkIn || !checkOut || isCheckingAvailability}
                className="btn-check-availability"
            >
                {isCheckingAvailability ? 'Verificando...' : 'Verificar Disponibilidad'}
            </button>

            {availabilityMessage && (
                <div className={`availability-message ${pricing ? 'available' : 'unavailable'}`}>
                    {availabilityMessage}
                </div>
            )}

            {pricing && (
                <>
                    <div className="pricing-summary">
                        <div className="pricing-row">
                            <span>COP$ {basePrice.toLocaleString('es-CO')} x {pricing.nights} noches</span>
                            <span>COP$ {pricing.basePrice.toLocaleString('es-CO')}</span>
                        </div>
                        <div className="pricing-row">
                            <span>Tarifa de limpieza</span>
                            <span>COP$ {pricing.cleaningFee.toLocaleString('es-CO')}</span>
                        </div>
                        {pricing.discount > 0 && (
                            <div className="pricing-row discount">
                                <span>Descuento</span>
                                <span>-COP$ {pricing.discount.toLocaleString('es-CO')}</span>
                            </div>
                        )}
                        <div className="pricing-row total">
                            <span>Total</span>
                            <span>COP$ {pricing.total.toLocaleString('es-CO')}</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Código promocional (opcional)</label>
                        <input type="text" {...register('promoCode')} placeholder="DESCUENTO10" />
                    </div>

                    <div className="form-group">
                        <label>Nombre completo</label>
                        <input type="text" {...register('guestName', { required: true })} />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" {...register('guestEmail', { required: true })} />
                    </div>

                    <div className="form-group">
                        <label>Teléfono</label>
                        <input type="tel" {...register('guestPhone')} />
                    </div>

                    <div className="form-group">
                        <label>Solicitudes especiales (opcional)</label>
                        <textarea {...register('specialRequests')} rows={3} />
                    </div>

                    <button type="submit" className="btn-submit">
                        Continuar al pago
                    </button>
                </>
            )}
        </form>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
    bookingId: string;
    amount: number;
    onPaymentSuccess?: () => void;
}

export default function PaymentForm({ bookingId, amount, onPaymentSuccess }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Create payment intent
        fetch('/api/payments/create-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId, amount }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, [bookingId, amount]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage('');

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/booking/confirmation?id=${bookingId}`,
            },
        });

        if (error) {
            setErrorMessage(error.message || 'Error al procesar el pago');
            setIsProcessing(false);
        } else {
            onPaymentSuccess?.();
        }
    };

    if (!clientSecret) {
        return <div className="payment-loading">Preparando pago...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <PaymentElement />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" disabled={!stripe || isProcessing} className="btn-pay">
                {isProcessing ? 'Procesando...' : `Pagar COP$ ${amount.toLocaleString('es-CO')}`}
            </button>
        </form>
    );
}

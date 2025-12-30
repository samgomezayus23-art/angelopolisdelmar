'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BookingForm from '@/components/BookingForm';

const CAPACITIES = [
    {
        id: 'apartasuite',
        title: 'ApartaSuite',
        capacity: '4 Personas',
        description: 'Suite ideal para familias pequeñas o parejas que buscan confort y estilo.',
        price: 250,
        propertyId: '2564495f-9b63-4269-8b2d-6eb77e340a1c'
    },
    {
        id: 'cabana',
        title: 'Cabaña',
        capacity: '12 Personas',
        description: 'Cuarto con 2 habitaciones equipadas con aire acondicionado.',
        price: 600,
        propertyId: 'e6fbd744-8d92-47f1-a62c-aaf864ee3692'
    },
    {
        id: 'casa',
        title: 'Casa',
        capacity: '16 Personas',
        description: 'Casa con 4 habitaciones, equipada con aire acondicionado.',
        price: 900,
        propertyId: '5ecbec5e-da1b-4c1f-85b7-a9ca4051085f'
    },
    {
        id: 'chalet',
        title: 'Chalet',
        capacity: '20 Personas',
        description: 'Casa completa, cuenta con 5 habitaciones.',
        price: 1200,
        propertyId: 'a7bf9bed-16ee-41a8-81fc-99f9b679f34a'
    }
];

export default function ReservationsPage() {
    const [selectedCapacity, setSelectedCapacity] = useState<string | null>(null);
    const router = useRouter();

    const selectedOption = CAPACITIES.find(c => c.id === selectedCapacity);

    const handleBookingComplete = (bookingId: string) => {
        // Redirect to payment page
        router.push(`/booking/${bookingId}`);
    };

    return (
        <div className="reservations-page container">
            <h1 className="page-title">Reservas</h1>
            <p className="page-subtitle">Selecciona la capacidad ideal para tu estadía</p>

            <div className="capacities-grid">
                {CAPACITIES.map((item) => (
                    <div
                        key={item.id}
                        className={`capacity-card ${selectedCapacity === item.id ? 'selected' : ''}`}
                        onClick={() => setSelectedCapacity(item.id)}
                    >
                        <h3>{item.title}</h3>
                        <div className="room-image-placeholder">
                            <span>Foto</span>
                        </div>
                        <div className="capacity-badge">{item.capacity}</div>
                        <p>{item.description}</p>
                        <div className="price-tag">Desde COP$ {item.price.toLocaleString('es-CO')}/noche</div>
                        <button className="btn-select">Seleccionar</button>
                    </div>
                ))}
            </div>

            {selectedCapacity && selectedOption && (
                <div className="booking-form-container" id="booking-form">
                    <h2>Reserva: {selectedOption.title}</h2>
                    <BookingForm
                        propertyId={selectedOption.propertyId}
                        basePrice={selectedOption.price}
                        onBookingComplete={handleBookingComplete}
                    />
                </div>
            )}
        </div>
    );
}

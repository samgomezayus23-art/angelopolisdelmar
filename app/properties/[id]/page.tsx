import { notFound } from 'next/navigation';
import BookingForm from '@/components/BookingForm';
import { supabase } from '@/lib/supabase';

export default async function PropertyDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { data: property, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !property) {
        notFound();
    }

    return (
        <div className="property-detail-page">
            <div className="container">
                {/* Property Gallery */}
                <div className="property-gallery">
                    <h1>{property.name}</h1>
                    {property.images && property.images.length > 0 && (
                        <div className="gallery-grid">
                            {property.images.slice(0, 5).map((image: string, index: number) => (
                                <div key={index} className="gallery-item">
                                    <img src={image} alt={`${property.name} - ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="property-content-grid">
                    {/* Property Info */}
                    <div className="property-info-section">
                        <h2>Descripción</h2>
                        <p>{property.description}</p>

                        <h3>Detalles</h3>
                        <ul className="details-list">
                            <li>Máximo {property.max_guests} huéspedes</li>
                            <li>{property.bedrooms} habitaciones</li>
                            <li>{property.bathrooms} baños</li>
                        </ul>

                        {property.amenities && property.amenities.length > 0 && (
                            <>
                                <h3>Amenidades</h3>
                                <ul className="amenities-list">
                                    {property.amenities.map((amenity: string, index: number) => (
                                        <li key={index}>{amenity}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        <h3>Ubicación</h3>
                        <p>{property.address}, {property.city}</p>
                    </div>

                    {/* Booking Form */}
                    <div className="booking-section">
                        <BookingForm
                            propertyId={property.id}
                            basePrice={property.base_price}
                            onBookingComplete={(bookingId) => {
                                window.location.href = `/booking/${bookingId}`;
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

import PropertyCard from '@/components/PropertyCard';

export default async function PropertiesPage() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/properties`, {
        cache: 'no-store',
    });
    const { properties } = await response.json();

    return (
        <div className="properties-page">
            <div className="container">
                <h1>Nuestras Propiedades</h1>
                <p className="page-subtitle">
                    Encuentra el alojamiento perfecto para tu estadía en Cartagena
                </p>

                <div className="properties-grid">
                    {properties && properties.length > 0 ? (
                        properties.map((property: any) => (
                            <PropertyCard
                                key={property.id}
                                id={property.id}
                                name={property.name}
                                description={property.description}
                                basePrice={property.base_price}
                                maxGuests={property.max_guests}
                                bedrooms={property.bedrooms}
                                bathrooms={property.bathrooms}
                                images={property.images || []}
                                amenities={property.amenities || []}
                            />
                        ))
                    ) : (
                        <p>No hay propiedades disponibles en este momento.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

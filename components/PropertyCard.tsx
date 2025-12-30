'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    images: string[];
    amenities: string[];
}

export default function PropertyCard({
    id,
    name,
    description,
    basePrice,
    maxGuests,
    bedrooms,
    bathrooms,
    images,
    amenities,
}: PropertyCardProps) {
    const mainImage = images && images.length > 0 ? images[0] : '/placeholder-property.jpg';

    return (
        <Link href={`/properties/${id}`} className="property-card">
            <div className="property-card-image">
                <Image
                    src={mainImage}
                    alt={name}
                    width={400}
                    height={300}
                    className="image"
                />
            </div>
            <div className="property-card-content">
                <h3 className="property-name">{name}</h3>
                <p className="property-description">{description}</p>
                <div className="property-details">
                    <span>{maxGuests} huéspedes</span>
                    <span>•</span>
                    <span>{bedrooms} habitaciones</span>
                    <span>•</span>
                    <span>{bathrooms} baños</span>
                </div>
                <div className="property-amenities">
                    {amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="amenity-tag">
                            {amenity}
                        </span>
                    ))}
                    {amenities.length > 3 && (
                        <span className="amenity-tag">+{amenities.length - 3} más</span>
                    )}
                </div>
                <div className="property-price">
                    <span className="price-amount">${basePrice}</span>
                    <span className="price-period">/ noche</span>
                </div>
            </div>
        </Link>
    );
}

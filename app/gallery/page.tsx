'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function GalleryPage() {
    // Placeholder images - in a real app these would be real URLs
    const images = [
        '/gallery/1.jpg', '/gallery/2.jpg', '/gallery/3.jpg', '/gallery/4.jpg',
        '/gallery/5.jpg', '/gallery/6.jpg', '/gallery/7.jpg', '/gallery/8.jpg',
        '/gallery/9.jpg', '/gallery/10.jpg', '/gallery/11.jpg', '/gallery/12.jpg',
        '/gallery/13.jpg', '/gallery/14.jpg', '/gallery/15.jpg', '/gallery/16.jpg',
        '/gallery/17.jpg', '/gallery/18.jpg', '/gallery/19.jpg', '/gallery/20.jpg'
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const nextIndex = (currentIndex + 1) % images.length;

    return (
        <div className="gallery-page container">
            <h1 className="page-title">Galería</h1>
            <p className="page-subtitle">Descubre nuestros espacios</p>

            <div className="gallery-carousel">
                <div className="carousel-main">
                    <button onClick={prevImage} className="carousel-btn prev" aria-label="Anterior">
                        &#10094;
                    </button>

                    <div className="main-image-container">
                        <div className="image-placeholder main">
                            <span>Foto {currentIndex + 1}</span>
                        </div>
                    </div>

                    <button onClick={nextImage} className="carousel-btn next" aria-label="Siguiente">
                        &#10095;
                    </button>
                </div>

                <div className="thumbnails-strip">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className={`thumbnail-item ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <div className="image-placeholder thumbnail">
                                <span>{index + 1}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

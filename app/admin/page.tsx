'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [syncStatus, setSyncStatus] = useState('');

    useEffect(() => {
        // Fetch properties
        fetch('/api/properties')
            .then((res) => res.json())
            .then((data) => setProperties(data.properties || []));
    }, []);

    const handleSyncAll = async () => {
        setSyncStatus('Sincronizando...');
        try {
            const response = await fetch('/api/sync/ical', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ syncAll: true }),
            });
            const data = await response.json();
            setSyncStatus(`Sincronización completada: ${data.results?.length || 0} feeds procesados`);
        } catch (error) {
            setSyncStatus('Error en la sincronización');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="container">
                <div className="admin-header">
                    <h1>Panel Administrativo</h1>
                    <p>Gestiona propiedades, reservas y configuraciones</p>
                </div>

                <div className="admin-grid">
                    {/* Properties Management */}
                    <div className="admin-card">
                        <h3>Propiedades</h3>
                        <p>Total: {properties.length}</p>
                        <button className="btn-secondary" style={{ marginTop: '1rem' }}>
                            Agregar Propiedad
                        </button>
                    </div>

                    {/* Bookings Overview */}
                    <div className="admin-card">
                        <h3>Reservas</h3>
                        <p>Pendientes: {bookings.filter((b: any) => b.status === 'pending').length}</p>
                        <p>Confirmadas: {bookings.filter((b: any) => b.status === 'confirmed').length}</p>
                    </div>

                    {/* iCal Sync */}
                    <div className="admin-card">
                        <h3>Sincronización iCal</h3>
                        <button className="btn-secondary" onClick={handleSyncAll}>
                            Sincronizar Ahora
                        </button>
                        {syncStatus && <p style={{ marginTop: '1rem' }}>{syncStatus}</p>}
                    </div>

                    {/* Promotions */}
                    <div className="admin-card">
                        <h3>Promociones</h3>
                        <button className="btn-secondary">
                            Crear Código Promocional
                        </button>
                    </div>
                </div>

                {/* Properties List */}
                <div style={{ marginTop: '2rem' }}>
                    <h2>Listado de Propiedades</h2>
                    <div style={{ marginTop: '1rem' }}>
                        {properties.map((property: any) => (
                            <div key={property.id} className="admin-card" style={{ marginBottom: '1rem' }}>
                                <h4>{property.name}</h4>
                                <p>{property.description}</p>
                                <p>
                                    <strong>Precio base:</strong> ${property.base_price} / noche
                                </p>
                                <p>
                                    <strong>Capacidad:</strong> {property.max_guests} huéspedes
                                </p>
                                <p>
                                    <strong>Estado:</strong> {property.is_active ? 'Activa' : 'Inactiva'}
                                </p>
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0'
                                }}>
                                    <h5 style={{ marginBottom: '0.5rem', color: '#64748b' }}>Exportación iCal (para Airbnb)</h5>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            readOnly
                                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/export/ical/${property.id}`}
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem',
                                                fontSize: '0.875rem',
                                                borderRadius: '4px',
                                                border: '1px solid #cbd5e1',
                                                backgroundColor: '#fff'
                                            }}
                                        />
                                        <button
                                            className="btn-secondary"
                                            style={{ padding: '0.5rem 1rem' }}
                                            onClick={() => {
                                                const url = `${window.location.origin}/api/export/ical/${property.id}`;
                                                navigator.clipboard.writeText(url);
                                                alert('Enlace copiado al portapapeles');
                                            }}
                                        >
                                            Copiar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

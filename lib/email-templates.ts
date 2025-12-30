interface BookingEmailProps {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    propertyName?: string;
}

export function generateBookingConfirmationEmail({
    bookingId,
    guestName,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    propertyName = 'Angelopolis del Mar',
}: BookingEmailProps) {
    const checkInDate = new Date(checkIn).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const checkOutDate = new Date(checkOut).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return {
        subject: `Confirmación de Reserva - ${propertyName}`,
        html: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Reserva</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">¡Reserva Confirmada!</h1>
                            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Gracias por elegir ${propertyName}</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Hola <strong>${guestName}</strong>,
                            </p>
                            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                Tu reserva ha sido confirmada exitosamente. A continuación encontrarás los detalles de tu estadía:
                            </p>
                            
                            <!-- Booking Details -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                        <strong style="color: #6b7280; font-size: 14px;">ID de Reserva:</strong>
                                    </td>
                                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #111827; font-size: 14px; font-family: monospace;">${bookingId}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                        <strong style="color: #6b7280; font-size: 14px;">Check-in:</strong>
                                    </td>
                                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #111827; font-size: 14px;">${checkInDate}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                        <strong style="color: #6b7280; font-size: 14px;">Check-out:</strong>
                                    </td>
                                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #111827; font-size: 14px;">${checkOutDate}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                        <strong style="color: #6b7280; font-size: 14px;">Huéspedes:</strong>
                                    </td>
                                    <td align="right" style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #111827; font-size: 14px;">${guests} persona${guests > 1 ? 's' : ''}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 0 0 0;">
                                        <strong style="color: #1e3a8a; font-size: 16px;">Total Pagado:</strong>
                                    </td>
                                    <td align="right" style="padding: 15px 0 0 0;">
                                        <strong style="color: #1e3a8a; font-size: 18px;">$${totalPrice.toLocaleString('es-CO')}</strong>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Important Info -->
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                                <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                                    <strong>Importante:</strong> Por favor, guarda este correo como comprobante de tu reserva. Te recomendamos llegar a partir de las 3:00 PM el día de check-in.
                                </p>
                            </div>
                            
                            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.
                            </p>
                            
                            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                                ¡Esperamos verte pronto!<br>
                                <strong>Equipo de ${propertyName}</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.6;">
                                Este es un correo automático, por favor no respondas a este mensaje.<br>
                                © ${new Date().getFullYear()} ${propertyName}. Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    };
}

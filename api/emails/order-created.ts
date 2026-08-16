import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { orderData } = req.body;
    if (!orderData || !orderData.customer) {
      return res.status(400).json({ error: 'Faltan datos del pedido' });
    }

    const mailOptions = {
      from: `"Obsidiana Logística" <${process.env.SMTP_USER}>`,
      to: orderData.customer.email,
      subject: `¡Confirmación de Pedido ${orderData.orderNumber}! Código de Tracking: ${orderData.trackingCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-top: 0;">¡Hola ${orderData.customer.name}, hemos recibido tu pedido!</h2>
          <p>Tu orden <strong>${orderData.orderNumber}</strong> ha sido registrada exitosamente. Puedes dar seguimiento en tiempo real con tu código de rastreo.</p>
          <div style="background: #ffffff; padding: 16px; border: 1px solid #e2e8f0; border-radius: 6px; margin: 16px 0;">
            <p><strong>Código de Tracking:</strong> <span style="font-size: 18px; color: #2563eb; font-weight: bold;">${orderData.trackingCode}</span></p>
            <p><strong>Dirección de Entrega:</strong> ${orderData.customer.address}</p>
            <p><strong>Total Cancelado:</strong> S/ ${Number(orderData.total).toFixed(2)}</p>
          </div>
          <p>Atentamente,<br><strong>Equipo de Logística & Envíos</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error: any) {
    console.error('Error enviando correo:', error);
    return res.status(500).json({ error: error.message || 'Error interno al enviar correo' });
  }
}

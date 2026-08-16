import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { status, note, orderData } = req.body;
    
    if (!orderData || !orderData.customer) {
      return res.status(400).json({ error: 'Faltan datos del pedido para enviar el correo' });
    }

    let emailSubject = `Actualización de tu pedido ${orderData.orderNumber}`;
    if (status === "en_ruta") {
      emailSubject = `🚚 Tu pedido ${orderData.orderNumber} está en camino - Tracking: ${orderData.trackingCode}`;
    } else if (status === "entregado") {
      emailSubject = `🎉 ¡Tu pedido ${orderData.orderNumber} ha sido entregado con éxito!`;
    }

    const mailOptions = {
      from: `"Obsidiana Logística" <${process.env.SMTP_USER}>`,
      to: orderData.customer.email,
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8fafc; color: #1e293b;">
          <h2 style="color: #2563eb;">Estado de Envío Actualizado</h2>
          <p>Hola <strong>${orderData.customer.name}</strong>, el estado de tu pedido <strong>${orderData.orderNumber}</strong> ha cambiado a: <span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${status.toUpperCase()}</span>.</p>
          <p>${note || 'Tu paquete está siendo procesado con máxima prioridad.'}</p>
          <hr style="border:0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p>Código de seguimiento: <strong>${orderData.trackingCode}</strong></p>
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

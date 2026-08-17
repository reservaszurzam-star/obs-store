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

      const emailHtml = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFCFB; color: #181716; padding: 40px 20px; border: 1px solid #E4DFD7;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 24px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; margin: 0;">Obsidiana</h1>
            <p style="font-size: 10px; letter-spacing: 2px; color: #A59B8F; text-transform: uppercase; margin-top: 5px;">Plata & Joyería</p>
          </div>
          
          <div style="border-top: 1px solid #E4DFD7; border-bottom: 1px solid #E4DFD7; padding: 20px 0; margin-bottom: 30px;">
            <h2 style="font-size: 16px; font-weight: bold; text-align: center; margin-top: 0;">NOTA DE VENTA ELECTRÓNICA</h2>
            <p style="font-size: 14px; text-align: center; color: #61564A; margin-bottom: 0;">Pedido #${orderData.orderNumber}</p>
          </div>

          <p style="font-size: 14px; margin-bottom: 8px;"><strong>Cliente:</strong> ${orderData.customer.name}</p>
          <p style="font-size: 14px; margin-bottom: 8px;"><strong>Documento:</strong> ${orderData.customer.document || 'N/A'}</p>
          <p style="font-size: 14px; margin-bottom: 8px;"><strong>Dirección de Entrega:</strong> ${orderData.customer.address}</p>
          
          <table style="width: 100%; margin-top: 40px; border-collapse: collapse; font-size: 14px;">
            <thead>
              <tr style="border-bottom: 1px solid #181716; text-align: left;">
                <th style="padding: 10px 0; font-weight: bold;">Cant</th>
                <th style="padding: 10px 0; font-weight: bold;">Descripción</th>
                <th style="padding: 10px 0; text-align: right; font-weight: bold;">Importe</th>
              </tr>
            </thead>
            <tbody>
              ${(orderData.items || []).map((item: any) => `
              <tr style="border-bottom: 1px dashed #E4DFD7;">
                <td style="padding: 15px 0;">${item.quantity}</td>
                <td style="padding: 15px 0;">${item.productName}</td>
                <td style="padding: 15px 0; text-align: right;">S/ ${(Number(item.unitPrice) * Number(item.quantity)).toFixed(2)}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 20px; text-align: right; font-size: 14px; color: #61564A;">
            <p style="margin: 5px 0;">Subtotal: S/ ${Number(orderData.subtotal).toFixed(2)}</p>
            <p style="margin: 5px 0;">Envío: S/ ${Number(orderData.shippingFee).toFixed(2)}</p>
            <p style="font-size: 18px; font-weight: bold; color: #181716; margin-top: 15px;">Total: S/ ${Number(orderData.total).toFixed(2)}</p>
          </div>

          <div style="background-color: #181716; color: #FDFCFB; padding: 24px; border-radius: 4px; text-align: center; margin-top: 50px;">
            <p style="margin: 0; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #A59B8F;">Tu Código de Seguimiento</p>
            <p style="margin: 10px 0 0 0; font-size: 22px; font-weight: bold; letter-spacing: 2px;">${orderData.trackingCode}</p>
          </div>
          
          <p style="text-align: center; font-size: 12px; color: #A59B8F; margin-top: 40px; line-height: 1.6;">
            Gracias por tu compra.<br>Si tienes alguna consulta sobre tu pedido, puedes responder directamente a este correo.
          </p>
        </div>
      `;

    const mailOptions = {
      from: `"Obsidiana" <${process.env.SMTP_USER}>`,
      to: orderData.customer.email,
      subject: `Nota de Venta - Pedido #${orderData.orderNumber} - Obsidiana`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error: any) {
    console.error('Error enviando correo:', error);
    return res.status(500).json({ error: error.message || 'Error interno al enviar correo' });
  }
}

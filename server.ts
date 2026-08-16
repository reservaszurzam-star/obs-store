import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  INITIAL_PRODUCTS,
  INITIAL_PROVINCES,
  INITIAL_DISTRICTS,
  INITIAL_ZONES,
  INITIAL_ORDERS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_EMAIL_LOGS,
} from "./src/data/mockData";
import { Product, Province, District, Zone, Order, StockMovement, EmailLog, OrderStatus } from "./src/types";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL || 'reservaszurzam@gmail.com',
    pass: 'pwtw hipa paoj cvdq'
  }
});

// In-Memory Database Store
let dbProducts: Product[] = [...INITIAL_PRODUCTS];
let dbProvinces: Province[] = [...INITIAL_PROVINCES];
let dbDistricts: District[] = [...INITIAL_DISTRICTS];
let dbZones: Zone[] = [...INITIAL_ZONES];
let dbOrders: Order[] = [...INITIAL_ORDERS];
let dbStockMovements: StockMovement[] = [...INITIAL_STOCK_MOVEMENTS];
let dbEmailLogs: EmailLog[] = [...INITIAL_EMAIL_LOGS];

// Helpers
function generateTrackingCode(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `TRK-${num}`;
}

function generateOrderNumber(): string {
  const num = dbOrders.length + 93;
  return `PED-2026-${num.toString().padStart(4, '0')}`;
}

async function sendEmail(emailLog: EmailLog) {
  try {
    const info = await transporter.sendMail({
      from: `"Obsidiana Joyería" <${process.env.SMTP_EMAIL || 'reservaszurzam@gmail.com'}>`,
      to: emailLog.recipientEmail,
      subject: emailLog.subject,
      html: emailLog.bodyHtml,
    });
    console.log(`Email sent: ${info.messageId}`);
    emailLog.status = 'sent';
  } catch (error) {
    console.error('Error sending email:', error);
    emailLog.status = 'failed';
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serve static files from /public (images, etc.)
  app.use(express.static(path.join(process.cwd(), 'public')));

  // --- API ROUTES ---

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Bootstrap initial state for frontend
  app.get("/api/bootstrap", (_req, res) => {
    res.json({
      products: dbProducts,
      provinces: dbProvinces,
      districts: dbDistricts,
      zones: dbZones,
      orders: dbOrders,
      stockMovements: dbStockMovements,
      emailLogs: dbEmailLogs,
    });
  });

  // Track Order by Code
  app.get("/api/tracking/:code", (req, res) => {
    const code = req.params.code.trim().toUpperCase();
    const order = dbOrders.find(
      (o) => o.trackingCode.toUpperCase() === code || o.orderNumber.toUpperCase() === code
    );

    if (!order) {
      return res.status(404).json({ error: "Pedido o código de seguimiento no encontrado." });
    }

    res.json(order);
  });

  // ============================================================
  // AUTO-PROCESSING: Automated order status advancement
  // Simulates the realistic logistics flow based on elapsed time:
  //   pendiente -> en_preparacion (+15 min)
  //   en_preparacion -> en_ruta (+60 min)
  //   en_ruta -> entregado (+24h, or +6h for Lima express)
  // ============================================================
  const STATUS_ORDER: OrderStatus[] = ["pendiente", "en_preparacion", "en_ruta", "entregado", "cancelado"];

  function advanceTimelineToStatus(order: Order, upToStatus: OrderStatus) {
    const targetIndex = STATUS_ORDER.indexOf(upToStatus);
    order.timeline.forEach((s) => {
      const sIdx = STATUS_ORDER.indexOf(s.status as OrderStatus);
      if (targetIndex >= 0 && sIdx >= 0 && sIdx <= targetIndex && s.status !== "cancelado") {
        s.completed = true;
        if (!s.timestamp) s.timestamp = new Date().toISOString();
      }
    });
  }

  app.post("/api/orders/auto-process", (_req, res) => {
    const now = Date.now();
    const MIN = 60 * 1000;
    const processed: Array<{ orderNumber: string; from: OrderStatus; to: OrderStatus; action: string }> = [];

    dbOrders.forEach((order) => {
      if (order.status === "cancelado" || order.status === "entregado") return;

      const ageMin = (now - new Date(order.createdAt).getTime()) / MIN;
      const isLimaExpress =
        (order.customer.zone || "").toLowerCase().includes("express") ||
        (order.customer.province || "").toLowerCase() === "lima";

      let target: OrderStatus | null = null;
      let actionDesc = "";

      if (order.status === "pendiente" && ageMin >= 15) {
        target = "en_preparacion";
        actionDesc = "Tiempo de preparación alcanzado (15 min)";
      } else if (order.status === "en_preparacion" && ageMin >= 60) {
        target = "en_ruta";
        actionDesc = "Empaque y despacho completado (60 min)";
      } else if (order.status === "en_ruta" && ageMin >= (isLimaExpress ? 360 : 1440)) {
        target = "entregado";
        actionDesc = isLimaExpress
          ? "Entrega express Lima confirmada (6 horas)"
          : "Ventana de entrega interprovincial cumplida (24 horas)";
      }

      if (target) {
        const from = order.status;
        order.status = target;
        order.updatedAt = new Date().toISOString();
        if (target === "entregado") {
          order.estimatedDelivery = "Completado";
        }
        advanceTimelineToStatus(order, target);

        processed.push({ orderNumber: order.orderNumber, from, to: target, action: actionDesc });

        let subject = `Actualización de tu pedido ${order.orderNumber}`;
        let templateType: EmailLog["templateType"] = "order_dispatched";
        if (target === "en_ruta") {
          subject = `🚚 Tu pedido ${order.orderNumber} está en camino - Tracking: ${order.trackingCode}`;
          templateType = "out_for_delivery";
        } else if (target === "entregado") {
          subject = `🎉 ¡Tu pedido ${order.orderNumber} ha sido entregado con éxito!`;
          templateType = "delivered";
        } else if (target === "en_preparacion") {
          subject = `📦 Tu pedido ${order.orderNumber} está en preparación`;
          templateType = "order_dispatched";
        }

        const autoEmailLog: EmailLog = {
          id: `email-auto-${Date.now()}-${order.id}`,
          orderId: order.id,
          trackingCode: order.trackingCode,
          recipientEmail: order.customer.email,
          recipientName: order.customer.name,
          subject,
          templateType,
          sentAt: new Date().toISOString(),
          status: "sent",
          bodyHtml: `
            <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 8px;">
              <h2 style="color: #181716; margin-top: 0;">Hola <strong>${order.customer.name}</strong>,</h2>
              <p>Tu pedido <strong>${order.orderNumber}</strong> fue procesado automáticamente por nuestro sistema logístico.</p>
              <div style="background: #ffffff; padding: 16px; border: 1px solid #e2e8f0; border-radius: 6px; margin: 16px 0;">
                <p><strong>Nuevo estado:</strong> <span style="background:#E4DFD7;color:#181716;padding:4px 10px;border-radius:4px;font-weight:bold;">${target.toUpperCase().replace("_"," ")}</span></p>
                <p><strong>Código de seguimiento:</strong> <span style="font-size:16px;color:#61564A;font-weight:bold;">${order.trackingCode}</span></p>
                <p><strong>Razón automática:</strong> ${actionDesc}</p>
              </div>
              <p style="font-size:12px;color:#64748b;">Notificación automática · Obsidiana Joyería Perú</p>
            </div>
          `,
        };
        dbEmailLogs.unshift(autoEmailLog);
        sendEmail(autoEmailLog);
      }
    });

    res.json({
      message: `Proceso automático completado. ${processed.length} pedido(s) avanzaron de estado.`,
      processed,
      emailLogs: dbEmailLogs,
      orders: dbOrders,
    });
  });

  // Create New Order (Original logic for local db)
  app.post("/api/orders", (req, res) => {
    try {
      const { customer, items, shippingFee, paymentMethod } = req.body;

      if (!customer || !items || !items.length) {
        return res.status(400).json({ error: "Datos de cliente e ítems son requeridos." });
      }

      // Check stock availability
      for (const item of items) {
        const prod = dbProducts.find((p) => p.id === item.productId);
        if (!prod) {
          return res.status(400).json({ error: `Producto no encontrado: ${item.productName}` });
        }
        if (prod.stock < item.quantity) {
          return res.status(400).json({
            error: `Stock insuficiente para ${prod.name}. Stock actual: ${prod.stock}, Solicitado: ${item.quantity}`,
          });
        }
      }

      // Deduct stock and record movements
      items.forEach((item: any) => {
        const prod = dbProducts.find((p) => p.id === item.productId);
        if (prod) {
          prod.stock -= item.quantity;
          prod.updatedAt = new Date().toISOString();

          dbStockMovements.unshift({
            id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            productId: prod.id,
            productName: prod.name,
            type: "out",
            quantity: item.quantity,
            reason: `Venta realizada - Pedido ${generateOrderNumber()}`,
            timestamp: new Date().toISOString(),
            performedBy: "Sistema de Pedidos",
          });
        }
      });

      const orderNumber = generateOrderNumber();
      const trackingCode = generateTrackingCode();
      const subtotal = items.reduce((acc: number, item: any) => acc + item.unitPrice * item.quantity, 0);
      const total = subtotal + Number(shippingFee);

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        trackingCode,
        customer,
        items,
        subtotal,
        shippingFee: Number(shippingFee),
        total,
        paymentMethod,
        status: "pendiente",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: "2 a 5 días hábiles",
        timeline: [
          {
            id: `step-1-${Date.now()}`,
            status: "pendiente",
            title: "Pedido Recibido",
            description: "Hemos recibido tu pedido y el pago ha sido confirmado.",
            location: "Sistema Logístico",
            timestamp: new Date().toISOString(),
            completed: true,
          },
          {
            id: `step-2-${Date.now()}`,
            status: "en_preparacion",
            title: "En Preparación",
            description: "Tu pedido está siendo empaquetado cuidadosamente.",
            location: "Almacén Central",
            timestamp: "",
            completed: false,
          },
          {
            id: `step-3-${Date.now()}`,
            status: "en_ruta",
            title: "En Ruta de Entrega",
            description: "El paquete fue entregado al courier y está en camino.",
            location: "Centro de Distribución",
            timestamp: "",
            completed: false,
          },
          {
            id: `step-4-${Date.now()}`,
            status: "entregado",
            title: "Entregado en Dirección",
            description: `Confirmación de entrega en ${customer.address}`,
            location: customer.address,
            timestamp: "",
            completed: false,
          },
        ],
        courier: {
          driverName: "Courier Asignado por Zona",
          driverPhone: "+51 900 000 000",
          vehicle: "Unidad Móvil Logística",
          licensePlate: "ENV-2026",
        },
      };

      dbOrders.unshift(newOrder);

      res.status(201).json({ order: newOrder, products: dbProducts });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Error al crear el pedido" });
    }
  });

  // Endpoint specific for sending Order Created Email
  app.post("/api/emails/order-created", (req, res) => {
    try {
      const { orderData } = req.body;
      if (!orderData || !orderData.customer) {
        return res.status(400).json({ error: "Faltan datos del pedido" });
      }

      const emailNotification: EmailLog = {
        id: `email-${Date.now()}`,
        orderId: orderData.id || `ord-${Date.now()}`,
        trackingCode: orderData.trackingCode,
        recipientEmail: orderData.customer.email,
        recipientName: orderData.customer.name,
        subject: `¡Confirmación de Pedido ${orderData.orderNumber}! Código de Tracking: ${orderData.trackingCode}`,
        templateType: "order_created",
        sentAt: new Date().toISOString(),
        status: "sent",
        bodyHtml: `
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

      dbEmailLogs.unshift(emailNotification);
      sendEmail(emailNotification);

      res.status(200).json({ success: true, email: emailNotification });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Error enviando correo" });
    }
  });

  // Update Order Status
  app.put("/api/orders/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, note, courier, orderData } = req.body as { status: OrderStatus; note?: string; courier?: any; orderData?: any };

    let order = dbOrders.find((o) => o.id === id);
    if (!order) {
      if (orderData) {
        order = { ...orderData, status, updatedAt: new Date().toISOString() };
      } else {
        return res.status(404).json({ error: "Pedido no encontrado." });
      }
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (courier) {
      order.courier = { ...order.courier, ...courier };
    }

    // Update timeline steps
    if (status === "en_preparacion") {
      const step = order.timeline.find((s) => s.status === "en_preparacion");
      if (step) {
        step.completed = true;
        step.timestamp = new Date().toISOString();
        if (note) step.description = note;
      }
    } else if (status === "en_ruta") {
      order.timeline.forEach((s) => {
        if (s.status === "pendiente" || s.status === "en_preparacion" || s.status === "en_ruta") {
          s.completed = true;
          if (!s.timestamp) s.timestamp = new Date().toISOString();
        }
      });
    } else if (status === "entregado") {
      order.timeline.forEach((s) => {
        s.completed = true;
        if (!s.timestamp) s.timestamp = new Date().toISOString();
      });
    }

    // Generate Email Log for Status Change
    let emailSubject = `Actualización de tu pedido ${order.orderNumber}`;
    let emailTemplateType: EmailLog["templateType"] = "order_dispatched";

    if (status === "en_ruta") {
      emailSubject = `🚚 Tu pedido ${order.orderNumber} está en camino - Tracking: ${order.trackingCode}`;
      emailTemplateType = "out_for_delivery";
    } else if (status === "entregado") {
      emailSubject = `🎉 ¡Tu pedido ${order.orderNumber} ha sido entregado con éxito!`;
      emailTemplateType = "delivered";
    }

    const emailLog: EmailLog = {
      id: `email-${Date.now()}`,
      orderId: order.id,
      trackingCode: order.trackingCode,
      recipientEmail: order.customer.email,
      recipientName: order.customer.name,
      subject: emailSubject,
      templateType: emailTemplateType,
      sentAt: new Date().toISOString(),
      status: "sent",
      bodyHtml: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8fafc; color: #1e293b;">
          <h2 style="color: #2563eb;">Estado de Envío Actualizado</h2>
          <p>Hola <strong>${order.customer.name}</strong>, el estado de tu pedido <strong>${order.orderNumber}</strong> ha cambiado a: <span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${status.toUpperCase()}</span>.</p>
          <p>${note || 'Tu paquete está siendo procesado con máxima prioridad.'}</p>
          <hr style="border:0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p>Código de seguimiento: <strong>${order.trackingCode}</strong></p>
        </div>
      `,
    };

    dbEmailLogs.unshift(emailLog);
    sendEmail(emailLog);

    res.json({ order, email: emailLog });
  });

  // Product Inventory Management
  app.post("/api/products", (req, res) => {
    const { name, sku, category, price, stock, minStock, location } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Nombre y precio son obligatorios." });
    }

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      sku: sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      name,
      category: category || "General",
      price: Number(price),
      stock: Number(stock || 0),
      minStock: Number(minStock || 5),
      location: location || "Almacén Principal",
      updatedAt: new Date().toISOString(),
    };

    dbProducts.unshift(newProd);

    // Record movement if initial stock > 0
    if (newProd.stock > 0) {
      dbStockMovements.unshift({
        id: `mov-${Date.now()}`,
        productId: newProd.id,
        productName: newProd.name,
        type: "in",
        quantity: newProd.stock,
        reason: "Creación de producto con stock inicial",
        timestamp: new Date().toISOString(),
        performedBy: "Administrador de Inventario",
      });
    }

    res.status(201).json(newProd);
  });

  // Stock Adjustment Endpoint
  app.post("/api/products/:id/adjust-stock", (req, res) => {
    const { id } = req.params;
    const { quantity, type, reason, performedBy } = req.body;

    const prod = dbProducts.find((p) => p.id === id);
    if (!prod) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: "Ingresa una cantidad válida mayor a 0." });
    }

    if (type === "in") {
      prod.stock += qty;
    } else if (type === "out") {
      if (prod.stock < qty) {
        return res.status(400).json({ error: "No se puede retirar más del stock disponible." });
      }
      prod.stock -= qty;
    } else if (type === "adjustment") {
      prod.stock = qty;
    }

    prod.updatedAt = new Date().toISOString();

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      type: type || "adjustment",
      quantity: qty,
      reason: reason || "Ajuste manual de stock",
      timestamp: new Date().toISOString(),
      performedBy: performedBy || "Administrador",
    };

    dbStockMovements.unshift(movement);

    // AUTOMATIC LOW-STOCK ALERT: if stock now falls at/below minStock,
    // record an automatic "reorder" movement so the inventory module highlights it.
    if (prod.stock <= prod.minStock) {
      const skipAlertExistente = dbStockMovements.some(
        (m) => m.productId === prod.id && m.reason.includes("ALERTA STOCK CRÍTICO")
      );
      if (!skipAlertExistente) {
        dbStockMovements.unshift({
          id: `mov-alert-${Date.now()}`,
          productId: prod.id,
          productName: prod.name,
          type: "alert",
          quantity: 0,
          reason: `ALERTA STOCK CRÍTICO - ${prod.name} alcanzó su mínimo (${prod.stock}/${prod.minStock} un.). Se requiere reposición.`,
          timestamp: new Date().toISOString(),
          performedBy: "Sistema Automático",
        });
      }
    }

    res.json({ product: prod, movement });
  });

  // Zones & Geographic Shipping Rate Management
  app.post("/api/zones", (req, res) => {
    const { name, provinceId, shippingFee, estimatedDays, courierAssigned } = req.body;

    if (!name || !provinceId) {
      return res.status(400).json({ error: "Nombre de zona y provincia son obligatorios." });
    }

    const newZone: Zone = {
      id: `zone-${Date.now()}`,
      name,
      provinceId,
      shippingFee: Number(shippingFee || 15),
      estimatedDays: estimatedDays || "24 - 48 hrs",
      courierAssigned: courierAssigned || "Courier Local",
      status: "active",
    };

    dbZones.unshift(newZone);
    res.status(201).json(newZone);
  });

  // Add District to Zone
  app.post("/api/districts", (req, res) => {
    const { name, provinceId, zoneId } = req.body;
    if (!name || !provinceId || !zoneId) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    const newDist: District = {
      id: `dist-${Date.now()}`,
      name,
      provinceId,
      zoneId,
    };

    dbDistricts.push(newDist);
    res.status(201).json(newDist);
  });

  // Send Test Email Endpoint
  app.post("/api/emails/test-send", (req, res) => {
    const { recipientEmail, recipientName, subject, bodyHtml, orderId, trackingCode } = req.body;

    if (!recipientEmail || !subject) {
      return res.status(400).json({ error: "Email de destino y asunto son obligatorios." });
    }

    const emailLog: EmailLog = {
      id: `email-${Date.now()}`,
      orderId: orderId || "N/A",
      trackingCode: trackingCode || "SYS-NOTIF",
      recipientEmail,
      recipientName: recipientName || "Cliente",
      subject,
      templateType: "order_created",
      sentAt: new Date().toISOString(),
      status: "sent",
      bodyHtml: bodyHtml || `<p>Notificación enviada a ${recipientName || recipientEmail}</p>`,
    };

    dbEmailLogs.unshift(emailLog);
    res.json({ success: true, email: emailLog });
  });

  // Reset Data Endpoint
  app.post("/api/reset-data", (_req, res) => {
    dbProducts = [...INITIAL_PRODUCTS];
    dbProvinces = [...INITIAL_PROVINCES];
    dbDistricts = [...INITIAL_DISTRICTS];
    dbZones = [...INITIAL_ZONES];
    dbOrders = [...INITIAL_ORDERS];
    dbStockMovements = [...INITIAL_STOCK_MOVEMENTS];
    dbEmailLogs = [...INITIAL_EMAIL_LOGS];

    res.json({
      message: "Datos reiniciados con éxito",
      products: dbProducts,
      orders: dbOrders,
      zones: dbZones,
    });
  });

  // Vite middleware for development vs static serve in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server executing on http://0.0.0.0:${PORT}`);
  });
}

startServer();

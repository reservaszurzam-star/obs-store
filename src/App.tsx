import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { OrdersList } from './components/OrdersList';
import { PosModule } from './components/PosModule';
import { OrderRegistrationModal } from './components/OrderRegistrationModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import { InventoryModule } from './components/InventoryModule';
import { AddProductModal } from './components/AddProductModal';
import { StockMovementModal } from './components/StockMovementModal';
import { ShippingZonesModule } from './components/ShippingZonesModule';
import { AddZoneModal } from './components/AddZoneModal';
import { TrackingModule } from './components/TrackingModule';
import { ReportsModule } from './components/ReportsModule';
import { EmailNotificationsModule } from './components/EmailNotificationsModule';
import { 
  Product, 
  Province, 
  District, 
  Zone, 
  Order, 
  StockMovement, 
  EmailLog, 
  OrderStatus 
} from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'orders' | 'pos' | 'inventory' | 'shipping' | 'tracking' | 'reports' | 'emails'>('pos');

  // Backend state
  const [products, setProducts] = useState<Product[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);

  // Modals state
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [adjustStockProduct, setAdjustStockProduct] = useState<Product | null>(null);
  const [isAddZoneOpen, setIsAddZoneOpen] = useState(false);
  const [trackingCodeForSearch, setTrackingCodeForSearch] = useState('');

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Bootstrap initial data
  const loadInitialData = async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setProvinces(data.provinces || []);
        setDistricts(data.districts || []);
        setZones(data.zones || []);
        setOrders(data.orders || []);
        setStockMovements(data.stockMovements || []);
        setEmailLogs(data.emailLogs || []);
      }
    } catch (err) {
      console.error('Error cargando datos iniciales:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // --- API HANDLERS ---

  // 1. Submit Order
  const handleCreateOrder = async (orderData: any) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al crear pedido');
    }

    const data = await res.json();
    setOrders((prev) => [data.order, ...prev]);
    if (data.products) setProducts(data.products);
    if (data.email) setEmailLogs((prev) => [data.email, ...prev]);

    showToast(`¡Pedido ${data.order.orderNumber} creado con código de rastreo ${data.order.trackingCode}!`);
  };

  // 2. Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al actualizar estado');
    }

    const data = await res.json();
    setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(data.order);
    }
    if (data.email) {
      setEmailLogs((prev) => [data.email, ...prev]);
    }

    showToast(`Estado de pedido actualizado a "${status.toUpperCase()}". Correo enviado al cliente.`);
  };

  // 3. Add Product
  const handleAddProduct = async (productData: any) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al agregar producto');
    }

    const newProd = await res.json();
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Producto "${newProd.name}" agregado al inventario.`);
  };

  // 4. Adjust Stock
  const handleAdjustStock = async (
    productId: string,
    quantity: number,
    type: 'in' | 'out' | 'adjustment',
    reason: string,
    performedBy: string
  ) => {
    const res = await fetch(`/api/products/${productId}/adjust-stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity, type, reason, performedBy }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al ajustar stock');
    }

    const data = await res.json();
    setProducts((prev) => prev.map((p) => (p.id === productId ? data.product : p)));
    setStockMovements((prev) => [data.movement, ...prev]);
    showToast(`Stock actualizado para "${data.product.name}" (Nuevo stock: ${data.product.stock}).`);
  };

  // 5. Add Zone
  const handleAddZone = async (zoneData: any) => {
    const res = await fetch('/api/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zoneData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al agregar zona');
    }

    const newZone = await res.json();
    setZones((prev) => [newZone, ...prev]);
    showToast(`Nueva zona de envío "${newZone.name}" creada.`);
  };

  // 6. Add District
  const handleAddDistrict = async (districtData: any) => {
    const res = await fetch('/api/districts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(districtData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al agregar distrito');
    }

    const newDist = await res.json();
    setDistricts((prev) => [...prev, newDist]);
    showToast(`Distrito "${newDist.name}" mapeado exitosamente.`);
  };

  // 7. Test Email Send
  const handleSendTestEmail = async (
    recipientEmail: string,
    recipientName: string,
    subject: string,
    bodyHtml: string
  ) => {
    const res = await fetch('/api/emails/test-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientEmail, recipientName, subject, bodyHtml }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al enviar correo');
    }

    const data = await res.json();
    setEmailLogs((prev) => [data.email, ...prev]);
    showToast(`Correo de prueba enviado a ${recipientEmail}`);
  };

  // 8. Reset Data
  const handleResetData = async () => {
    if (!window.confirm('¿Deseas restablecer los datos de la aplicación a su estado inicial de demostración?')) {
      return;
    }

    try {
      const res = await fetch('/api/reset-data', { method: 'POST' });
      if (res.ok) {
        await loadInitialData();
        showToast('Datos del sistema restablecidos.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 9. Auto-process orders statuses (automated logistics flow)
  const handleAutoProcessOrders = async () => {
    const res = await fetch('/api/orders/auto-process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const err = await res.json();
      showToast(`Error en procesamiento automático: ${err.error || 'Intente nuevamente'}`, 'error');
      return;
    }

    const data = await res.json();
    setOrders(data.orders || []);
    setEmailLogs((prev) => [...(data.emailLogs || []), ...prev]);
    showToast(data.message || 'Procesamiento automático completado.');
  };

  // Jump to tracking tab with code
  const handleTrackCodeRedirect = (trackingCode: string) => {
    setTrackingCodeForSearch(trackingCode);
    setActiveTab('tracking');
  };

  // Badges
  const pendingOrdersCount = orders.filter((o) => o.status === 'pendiente' || o.status === 'en_preparacion').length;
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  return (
    <div className="min-h-screen bg-[#E4DFD7] text-[#181716] flex flex-col md:flex-row font-sans selection:bg-[#61564A] selection:text-[#E4DFD7]">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className={`p-4 rounded-xl shadow-xl border flex items-center space-x-3 text-xs font-semibold ${
            toast.type === 'success'
              ? 'bg-[#181716] border-[#61564A] text-[#E4DFD7]'
              : 'bg-red-950 border-red-700 text-red-100'
          }`}>
            <CheckCircle2 className="w-5 h-5 text-[#A59B8F] shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Side Navigation Bar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewOrder={() => setIsNewOrderOpen(true)}
        onResetData={handleResetData}
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
      />

      {/* Main Content Area (Beside Sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Main View Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'pos' && (
            <PosModule
              products={products}
              provinces={provinces}
              districts={districts}
              zones={zones}
              onSubmitOrder={handleCreateOrder}
              onSendTestEmail={handleSendTestEmail}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersList
              orders={orders}
              onSelectOrder={(ord) => setSelectedOrder(ord)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onTrackOrder={handleTrackCodeRedirect}
              onOpenNewOrder={() => setIsNewOrderOpen(true)}
              onAutoProcess={handleAutoProcessOrders}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryModule
              products={products}
              stockMovements={stockMovements}
              onOpenAddProduct={() => setIsAddProductOpen(true)}
              onOpenAdjustStock={(p) => setAdjustStockProduct(p)}
            />
          )}

          {activeTab === 'shipping' && (
            <ShippingZonesModule
              provinces={provinces}
              districts={districts}
              zones={zones}
              onOpenAddZone={() => setIsAddZoneOpen(true)}
              onAddDistrict={handleAddDistrict}
            />
          )}

          {activeTab === 'tracking' && (
            <TrackingModule
              orders={orders}
              initialSearchCode={trackingCodeForSearch}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsModule
              orders={orders}
              products={products}
            />
          )}

          {activeTab === 'emails' && (
            <EmailNotificationsModule
              emailLogs={emailLogs}
              onSendTestEmail={handleSendTestEmail}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#A59B8F]/30 bg-[#E4DFD7] py-4 px-6 text-center text-xs text-[#61564A]">
          <p>Obsidiana Joyería Perú © 2026 — Catálogo de Joyas en Plata 925/950, Gestión de Pedidos & Envíos.</p>
        </footer>
      </div>

      {/* Global Modals */}
      <OrderRegistrationModal
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        products={products}
        provinces={provinces}
        districts={districts}
        zones={zones}
        onSubmitOrder={handleCreateOrder}
      />

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
        onSendTestEmail={handleSendTestEmail}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <StockMovementModal
        isOpen={!!adjustStockProduct}
        product={adjustStockProduct}
        onClose={() => setAdjustStockProduct(null)}
        onAdjustStock={handleAdjustStock}
      />

      <AddZoneModal
        isOpen={isAddZoneOpen}
        onClose={() => setIsAddZoneOpen(false)}
        provinces={provinces}
        onAddZone={handleAddZone}
      />

    </div>
  );
}

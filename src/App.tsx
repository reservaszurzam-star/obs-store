import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { OrdersList } from './components/OrdersList';
import { PosModule } from './components/PosModule';
import { OrderRegistrationModal } from './components/OrderRegistrationModal';
import { OrderDetailModal } from './components/OrderDetailModal';
import { InventoryModule } from './components/InventoryModule';
import { PublicCatalog } from './components/PublicCatalog';
import { AddProductModal } from './components/AddProductModal';
import { StockMovementModal } from './components/StockMovementModal';
import { ShippingZonesModule } from './components/ShippingZonesModule';
import { AddZoneModal } from './components/AddZoneModal';
import { TrackingModule } from './components/TrackingModule';
import { ReportsModule } from './components/ReportsModule';
import { EmailNotificationsModule } from './components/EmailNotificationsModule';
import { ClientsModule } from './components/ClientsModule';
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
import {
  INITIAL_PRODUCTS,
  INITIAL_PROVINCES,
  INITIAL_DISTRICTS,
  INITIAL_ZONES,
  INITIAL_ORDERS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_EMAIL_LOGS,
} from './data/mockData';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import { productosService, pedidosService, configService, clientesService } from './lib/services';

export default function App() {
  const [activeTab, setActiveTab] = useState<'orders' | 'pos' | 'inventory' | 'shipping' | 'tracking' | 'reports' | 'emails' | 'clients'>('pos');

  // Backend state (initialized with local data so the deployed/static version
  // shows the full catalog even when the Express backend is not running)
  const [products, setProducts] = useState<Product[]>([...INITIAL_PRODUCTS]);
  const [provinces, setProvinces] = useState<Province[]>([...INITIAL_PROVINCES]);
  const [districts, setDistricts] = useState<District[]>([...INITIAL_DISTRICTS]);
  const [zones, setZones] = useState<Zone[]>([...INITIAL_ZONES]);
  const [orders, setOrders] = useState<Order[]>([...INITIAL_ORDERS]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([...INITIAL_STOCK_MOVEMENTS]);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([...INITIAL_EMAIL_LOGS]);

  // Modals state
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Nuevo estado para catálogo público
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.hash === '#rubenasmat');
  const [session, setSession] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
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
      const [dbProductos, dbZonas, dbProvincias, dbPedidos] = await Promise.all([
        productosService.getAll(),
        configService.getZonas(),
        configService.getProvincias(),
        pedidosService.getAll()
      ]);

      const mappedProducts: Product[] = dbProductos.map((p: any) => ({
        id: p.id,
        sku: p.sku || 'N/A',
        name: p.nombre,
        category: p.categoria,
        price: Number(p.precio),
        stock: p.stock,
        minStock: p.stock_minimo || 5,
        location: p.ubicacion || 'Almacén',
        updatedAt: p.updated_at,
        imageUrl: p.imagen_url || (p.sku ? `/productos/${p.sku.toLowerCase().replace('obs-', 'prod-')}.jpeg` : undefined),
        hoverImageUrl: p.sku ? `/productos/${p.sku.toLowerCase().replace('obs-', 'prod-')}-hover.jpeg` : undefined,
      }));

      const mappedOrders: Order[] = dbPedidos.map((p: any) => ({
        id: p.id,
        orderNumber: p.numero_pedido || p.numero_nota,
        trackingCode: p.codigo_tracking,
        customer: {
          name: p.cliente_nombre,
          email: p.cliente_email || '',
          phone: p.cliente_telefono || '',
          address: p.cliente_direccion || '',
          province: p.cliente_provincia || '',
          district: p.cliente_distrito || '',
          zone: p.cliente_zona || '',
          notes: p.cliente_notas || '',
        },
        items: p.pedido_items ? p.pedido_items.map((i: any) => ({
          productId: i.producto_id,
          productName: i.producto_nombre,
          sku: i.sku || '',
          quantity: i.cantidad,
          unitPrice: Number(i.precio_unitario),
          total: Number(i.total),
        })) : [],
        subtotal: Number(p.subtotal),
        shippingFee: Number(p.tarifa_envio || 0),
        total: Number(p.total),
        status: p.estado as OrderStatus,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        estimatedDelivery: p.entrega_estimada || '',
        paymentMethod: p.metodo_pago,
        timeline: [],
      }));

      // Siempre usamos los datos de Supabase, aunque estén vacíos
      setProducts(mappedProducts);
      setProvinces(dbProvincias.length > 0 ? dbProvincias : INITIAL_PROVINCES);
      setZones(dbZonas.length > 0 ? dbZonas : INITIAL_ZONES);
      setOrders(mappedOrders);

      // Distritos/Stock local
      setDistricts(INITIAL_DISTRICTS);
      setStockMovements(INITIAL_STOCK_MOVEMENTS);
      setEmailLogs(INITIAL_EMAIL_LOGS);

    } catch (err) {
      console.error('Error cargando datos desde Supabase:', err);
      // Fallback a INITIAL si la base de datos falla
      setProducts(INITIAL_PRODUCTS);
      setProvinces(INITIAL_PROVINCES);
      setDistricts(INITIAL_DISTRICTS);
      setZones(INITIAL_ZONES);
      setOrders(INITIAL_ORDERS);
      setStockMovements(INITIAL_STOCK_MOVEMENTS);
      setEmailLogs(INITIAL_EMAIL_LOGS);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Escuchar cambios en el hash de la URL
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === '#rubenasmat');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) setAuthError('Credenciales incorrectas');
    setAuthLoading(false);
  };


  // --- API HANDLERS ---

  // 1. Submit Order
  const handleCreateOrder = async (orderData: any) => {
    try {
      // Buscar o crear cliente primero
      let cliente_id = undefined;
      if (orderData.customer) {
        const id = await clientesService.buscarOCrear({
          nombre: orderData.customer.name,
          email: orderData.customer.email,
          telefono: orderData.customer.phone,
          direccion: orderData.customer.address,
          provincia: orderData.customer.province,
          distrito: orderData.customer.district,
        });
        if (id) cliente_id = id;
      }

      await pedidosService.crear({
        numero_nota: 'NV-' + Math.floor(Math.random() * 10000),
        cliente_id: cliente_id,
        cliente_nombre: orderData.customer.name,
        cliente_email: orderData.customer.email,
        cliente_telefono: orderData.customer.phone,
        cliente_direccion: orderData.customer.address,
        cliente_provincia: orderData.customer.province,
        cliente_distrito: orderData.customer.district,
        cliente_zona: orderData.customer.zone,
        cliente_notas: orderData.customer.notes,
        subtotal: orderData.subtotal,
        descuento: 0,
        costo_envio: orderData.shippingFee,
        total: orderData.total,
        adelanto: 0,
        saldo: orderData.total,
        tipo_entrega: orderData.shippingFee > 15 ? 'provincia' : 'express',
        metodo_pago: 'Efectivo',
        estado: 'pendiente',
        items: orderData.items.map((i: any) => ({
          producto_id: i.productId,
          producto_nombre: i.productName,
          cantidad: i.quantity,
          precio_unitario: i.unitPrice,
          total: i.total
        }))
      });

      showToast(`¡Pedido creado exitosamente!`);
      loadInitialData(); // Reload from DB to get the new order and updated stock
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || 'Error al crear pedido en Supabase');
    }
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
    try {
      await productosService.create({
        nombre: productData.name,
        categoria: productData.category,
        precio: productData.price,
        stock: productData.stock,
        stock_minimo: productData.minStock,
        sku: productData.sku,
        material: 'Plata 950',
        activo: true
      });
      showToast(`¡Producto "${productData.name}" agregado con éxito a Supabase!`);
      loadInitialData(); // reload from DB
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || 'Error al agregar producto en Supabase');
    }
  };

  // 4. Adjust Stock
  const handleAdjustStock = async (
    productId: string,
    quantity: number,
    type: 'in' | 'out' | 'adjustment',
    reason: string,
    performedBy: string
  ) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error('Producto no encontrado');
      
      let newStock = product.stock;
      if (type === 'in') newStock += quantity;
      if (type === 'out') newStock -= quantity;
      if (type === 'adjustment') newStock = quantity;

      await productosService.updateStock(productId, newStock);
      showToast(`¡Stock actualizado en Supabase para "${product.name}"!`);
      loadInitialData(); // reload from DB
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || 'Error al ajustar stock');
    }
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

  // Si es la vista pública, renderizar SOLAMENTE el catálogo virtual
  if (!isAdminRoute) {
    return <PublicCatalog products={products} />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-slate-100 text-center space-y-6">
          <div className="w-full flex justify-center mb-4">
             <img src="/LOGO PRINCIPAL/LOGO PRINCIPAL.png" alt="Logo Obsidiana" className="w-48 sm:w-56 h-auto object-contain mix-blend-multiply" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-widest text-[#181716]">ACCESO ADMIN</h2>
            <p className="text-xs text-slate-500 mt-2">Ingresa tus credenciales para continuar.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-center tracking-widest focus:outline-none focus:border-[#61564A]"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-center tracking-widest focus:outline-none focus:border-[#61564A]"
            />
            {authError && <p className="text-red-500 text-xs font-bold">{authError}</p>}
            <button disabled={authLoading} type="submit" className="w-full bg-[#61564A] text-[#E4DFD7] font-bold py-3 rounded-lg uppercase tracking-wider hover:bg-[#181716] transition-colors disabled:opacity-50">
              {authLoading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
          <button onClick={() => { window.location.hash = ''; window.location.reload(); }} className="text-xs text-slate-400 hover:text-[#61564A] underline mt-4">
            Ir a la Tienda Pública
          </button>
        </div>
      </div>
    );
  }

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

          {activeTab === 'clients' && (
            <ClientsModule orders={orders} />
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

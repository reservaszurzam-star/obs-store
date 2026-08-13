import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  Gem, 
  Truck, 
  DollarSign, 
  Search, 
  User, 
  FileText, 
  QrCode, 
  X,
  CreditCard,
  Building,
  Mail,
  Phone,
  MapPin,
  Send,
  Scan,
  Gift,
  Zap,
  Calculator,
  Tag,
  Check,
  Scissors,
  Instagram,
  Heart,
  Compass,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { Product, Province, District, Zone, OrderItem } from '../types';
import { MapLocationPickerModal } from './MapLocationPickerModal';
import { PackageShippingLabelModal } from './PackageShippingLabelModal';

interface PosModuleProps {
  products: Product[];
  provinces: Province[];
  districts: District[];
  zones: Zone[];
  onSubmitOrder: (orderData: any) => Promise<void>;
  onSendTestEmail?: (email: string, name: string, subject: string, html: string) => Promise<void>;
}

// Custom Vector SVG Brand Logo (Obsidiana Concentric Double Oval Rings)
export const ObsidianaLogoSvg: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="50" cy="50" rx="36" ry="46" stroke="currentColor" strokeWidth="5" />
    <ellipse cx="50" cy="50" rx="22" ry="38" stroke="currentColor" strokeWidth="3.5" />
  </svg>
);

// Custom Vector SVG Motorcycle Delivery Scooter Icon (Lima)
export const MotorbikeIconSvg: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="46" r="8" />
    <circle cx="48" cy="46" r="8" />
    <path d="M18 46h16l8-18h10" />
    <path d="M26 28h12v18" />
    <path d="M38 18l-6 10" />
    <path d="M46 16h6" />
    <path d="M12 36l6 10" />
    <path d="M42 28h10v8h-6" />
  </svg>
);

// Custom Vector SVG Package Box Icon (Provincia)
export const PackageBoxIconSvg: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M32 8L54 20V44L32 56L10 44V20L32 8Z" />
    <path d="M32 8V56" />
    <path d="M10 20L32 32L54 20" />
    <path d="M20 14.5L42 26.5" />
  </svg>
);

export const PosModule: React.FC<PosModuleProps> = ({
  products,
  provinces,
  districts,
  zones,
  onSubmitOrder,
  onSendTestEmail,
}) => {
  // Push button active section filter
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [metalFilter, setMetalFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // SKU Barcode Scanner Input
  const [skuScanInput, setSkuScanInput] = useState<string>('');
  const [scanMessage, setScanMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Cart state
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);

  // Customer form state
  const [customerName, setCustomerName] = useState('');
  const [customerDoc, setCustomerDoc] = useState(''); // DNI or RUC
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('Lima');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerReference, setCustomerReference] = useState('');
  const [customerCoords, setCustomerCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isPackageLabelOpen, setIsPackageLabelOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Yape/Plin' | 'Tarjeta (Visa/MC)' | 'Transferencia BCP/Interbank' | 'Efectivo / Contraentrega'>('Yape/Plin');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [deliveryType, setDeliveryType] = useState<'express' | 'provincia' | 'tienda'>('express');
  const [shippingAgency, setShippingAgency] = useState<string>('Motorizado');
  const [adelantoAmount, setAdelantoAmount] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Modal receipt view state
  const [receiptTab, setReceiptTab] = useState<'lima' | 'provincia' | 'cliente_frente' | 'cliente_reverso' | 'todas'>('lima');
  const [generatedReceipt, setGeneratedReceipt] = useState<{
    orderNumber: string;
    trackingCode: string;
    receiptNumber: string;
    date: string;
    customer: {
      name: string;
      doc: string;
      phone: string;
      email: string;
      address: string;
      reference: string;
      province: string;
      district: string;
      coords?: { lat: number; lng: number } | null;
    };
    items: (OrderItem & { material?: string })[];
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
    adelanto: number;
    saldo: number;
    saldoTexto: string;
    paymentMethod: string;
    deliveryType: string;
    viaEnvio: string;
    cashTendered?: number;
    changeAmount?: number;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'cliente_envio' | 'pago_totales'>('cliente_envio');

  // Available categories list
  const categoriesList = ['Aretes', 'Conjuntos', 'Collares', 'Pulseras', 'Anillos'];

  // Filtered Districts based on province
  const availableDistricts = useMemo(() => {
    const provObj = provinces.find((p) => p.name.toLowerCase() === selectedProvince.toLowerCase());
    if (!provObj) return districts;
    return districts.filter((d) => d.provinceId === provObj.id);
  }, [provinces, districts, selectedProvince]);

  // Shipping Fee calculation
  const shippingFee = useMemo(() => {
    if (deliveryType === 'tienda') return 0;
    if (deliveryType === 'express') return 10;
    if (deliveryType === 'provincia') return 18;
    return 10;
  }, [deliveryType]);

  // Filter products by push buttons
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchMetal = true;
      if (metalFilter === '950') matchMetal = p.name.toLowerCase().includes('950');
      if (metalFilter === '925') matchMetal = p.name.toLowerCase().includes('925');

      return matchCat && matchSearch && matchMetal;
    });
  }, [products, activeCategory, searchQuery, metalFilter]);

  // Cart Add / Remove / Quantity controls
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // SKU Direct Barcode Scanner Search
  const handleScanSkuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skuScanInput.trim()) return;

    const query = skuScanInput.trim().toLowerCase();
    const found = products.find(
      (p) => p.sku.toLowerCase() === query || p.name.toLowerCase().includes(query)
    );

    if (found) {
      if (found.stock <= 0) {
        setScanMessage({ text: `⚠️ La joya ${found.name} (${found.sku}) está agotada.`, type: 'error' });
      } else {
        handleAddToCart(found);
        setScanMessage({ text: `✅ ¡Agregado! ${found.name} (S/ ${found.price.toFixed(2)})`, type: 'success' });
      }
    } else {
      setScanMessage({ text: `❌ SKU o joya "${skuScanInput}" no encontrada.`, type: 'error' });
    }

    setSkuScanInput('');
    setTimeout(() => setScanMessage(null), 3500);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Cart Totals
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const total = useMemo(() => {
    const calculated = subtotal + shippingFee - discount;
    return calculated > 0 ? calculated : 0;
  }, [subtotal, shippingFee, discount]);

  // Change amount calculation for cash payments
  const changeAmount = useMemo(() => {
    if (paymentMethod !== 'Efectivo / Contraentrega') return 0;
    const diff = cashTendered - total;
    return diff > 0 ? diff : 0;
  }, [paymentMethod, cashTendered, total]);

  // Customer Presets
  const setQuickCustomerLimaExample = () => {
    setCustomerName('María Fernanda López');
    setCustomerDoc('47985621');
    setCustomerPhone('987 654 321');
    setCustomerEmail('maria.lopez@gmail.com');
    setSelectedProvince('Lima');
    setSelectedDistrict('Lince');
    setCustomerAddress('Av. Arequipa 1234, Lince – Lima');
    setCustomerReference('Alt. Cdra. 12 de Av. Arequipa');
    setCustomerCoords({ lat: -12.0894, lng: -77.0335 });
    setDeliveryType('express');
    setShippingAgency('Motorizado');
    setAdelantoAmount(14);
    setReceiptTab('lima');
  };

  const setQuickCustomerProvinciaExample = () => {
    setCustomerName('Carlos Daniel Quispe');
    setCustomerDoc('70894512');
    setCustomerPhone('943 210 987');
    setCustomerEmail('carlos.quispe@gmail.com');
    setSelectedProvince('Cusco');
    setSelectedDistrict('Wanchaq');
    setCustomerAddress('Urb. Santa Mónica B-4, Wanchaq');
    setCustomerReference('A 2 cuadras del Óvalo Pachacútec');
    setCustomerCoords({ lat: -13.5319, lng: -71.9675 });
    setDeliveryType('provincia');
    setShippingAgency('Agencia de Transporte (Shalom/Olva)');
    setAdelantoAmount(30);
    setReceiptTab('provincia');
  };

  // Discount Presets
  const applyPercentDiscount = (percent: number) => {
    const calculated = (subtotal * percent) / 100;
    setDiscount(Math.round(calculated * 100) / 100);
  };

  const applyFixedDiscount = (amount: number) => {
    setDiscount(amount);
  };

  // Notes Preset Chips
  const appendNoteTag = (tag: string) => {
    setNotes((prev) => (prev ? `${prev} | ${tag}` : tag));
  };

  // Generate Nota de Venta Submit Handler
  const handleGenerateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Agrega al menos una joya al carrito para generar la Nota de Venta.');
      return;
    }

    if (!customerName.trim()) {
      alert('Por favor ingresa el nombre del cliente.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cartItems.map((item) => {
        // Detect silver purity material
        let material = 'Plata 950';
        if (item.product.name.includes('925') || item.product.sku.includes('925')) {
          material = 'Plata 925';
        }

        return {
          productId: item.product.id,
          productName: item.product.name,
          sku: item.product.sku,
          quantity: item.quantity,
          unitPrice: item.product.price,
          total: item.product.price * item.quantity,
          material,
        };
      });

      const orderPayload = {
        customer: {
          name: customerName,
          email: customerEmail || `${customerDoc || 'cli'}@obsidiana.pe`,
          phone: customerPhone || '999888777',
          address: customerAddress || 'Entrega Local / Tienda',
          province: selectedProvince,
          district: selectedDistrict || 'Lima',
          zone: deliveryType === 'tienda' ? 'Recojo Tienda' : deliveryType === 'express' ? 'Lima Express' : 'Provincias Shalom/Olva',
          notes: notes ? `DNI/RUC: ${customerDoc}. ${notes}` : `DNI/RUC: ${customerDoc}`,
        },
        items: orderItems,
        subtotal,
        shippingFee,
        discount,
        total,
        paymentMethod,
      };

      await onSubmitOrder(orderPayload);

      // Create Receipt Preview
      const isProvincia = deliveryType === 'provincia' || selectedProvince.toLowerCase() !== 'lima';
      const receiptNum = isProvincia ? `N° 0002-${Math.floor(100000 + Math.random() * 900000)}` : `N° 0001-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackCode = `OBS-${Math.floor(100000 + Math.random() * 900000)}`;

      const actualAdelanto = adelantoAmount > 0 ? adelantoAmount : (paymentMethod === 'Efectivo / Contraentrega' ? 0 : total);
      const saldoCalculated = total - actualAdelanto;

      let saldoTexto = 'PAGADO';
      if (saldoCalculated > 0) {
        saldoTexto = isProvincia ? 'Al llegar a agencia' : 'Contra entrega';
      }

      setGeneratedReceipt({
        orderNumber: receiptNum,
        trackingCode: trackCode,
        receiptNumber: receiptNum,
        date: new Date().toLocaleDateString('es-PE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        customer: {
          name: customerName,
          doc: customerDoc || 'Sin DNI',
          phone: customerPhone || '987 654 321',
          email: customerEmail || 'ventas@obsidiana.pe',
          address: customerAddress || 'Av. Arequipa 1234, Lince – Lima',
          reference: customerReference || 'Alt. Cdra. 12 de Av. Arequipa',
          province: selectedProvince,
          district: selectedDistrict || 'Lima',
          coords: customerCoords,
        },
        items: orderItems,
        subtotal,
        shippingFee,
        discount,
        total,
        adelanto: actualAdelanto,
        saldo: saldoCalculated > 0 ? saldoCalculated : 0,
        saldoTexto,
        paymentMethod,
        deliveryType: deliveryType === 'tienda' ? 'Recojo en Tienda Surco' : deliveryType === 'express' ? 'Motorizado' : 'Agencia de Transporte',
        viaEnvio: isProvincia ? 'Agencia de Transporte' : 'Motorizado',
        cashTendered: paymentMethod === 'Efectivo / Contraentrega' ? cashTendered : undefined,
        changeAmount: paymentMethod === 'Efectivo / Contraentrega' ? changeAmount : undefined,
      });

      // Auto select matching tab
      setReceiptTab(isProvincia ? 'provincia' : 'lima');

    } catch (err: any) {
      alert(`Error al procesar la venta: ${err.message || 'Intente nuevamente'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    if (!generatedReceipt) return;
    const phone = generatedReceipt.customer.phone.replace(/\D/g, '');
    const msg = `*OBSIDIANA JOYERÍA PERÚ - NOTA DE VENTA ${generatedReceipt.receiptNumber}*\n\nHola ${generatedReceipt.customer.name}, gracias por tu compra.\n\n*Detalle de tu Pedido:*\n${generatedReceipt.items.map((i) => `• ${i.quantity}x ${i.productName} (${i.material || 'Plata 950'}) - S/ ${i.total.toFixed(2)}`).join('\n')}\n\n*TOTAL:* S/ ${generatedReceipt.total.toFixed(2)}\n*ADELANTO:* S/ ${generatedReceipt.adelanto.toFixed(2)}\n*SALDO:* ${generatedReceipt.saldo > 0 ? `S/ ${generatedReceipt.saldo.toFixed(2)} (${generatedReceipt.saldoTexto})` : 'PAGADO'}\n\n*Forma de Envío:* ${generatedReceipt.viaEnvio}\n*Contacto:* 987 654 321 | @obsidiana.joyeria\n\n¡Garantía de por vida en autenticidad de Plata 925/950!`;
    const url = `https://wa.me/51${phone || '987654321'}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#161716] text-[#E4DFD7] p-5 rounded-2xl border border-[#61564A]/50 shadow-md">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#61564A] flex items-center justify-center text-[#E4DFD7] border border-[#A59B8F]/40 shadow-inner">
              <ObsidianaLogoSvg className="w-6 h-6 text-[#E4DFD7]" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider uppercase text-[#E4DFD7] flex items-center gap-2">
                <span>Punto de Venta POS & Notas de Venta</span>
                <span className="bg-[#E4DFD7] text-[#161716] text-[10px] px-2 py-0.5 rounded font-black tracking-normal">
                  PDF / A4 / OFICIAL
                </span>
              </h1>
              <p className="text-xs text-[#A59B8F] mt-0.5">
                Plantillas idénticas a comprobantes oficiales: Lima Motorizado, Provincia Agencia y Registro de Clientes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={setQuickCustomerLimaExample}
            className="bg-[#61564A] hover:bg-[#A59B8F] hover:text-[#161716] text-[#E4DFD7] px-3 py-1.5 rounded-xl text-xs font-bold border border-[#A59B8F]/30 flex items-center space-x-1 transition-all cursor-pointer"
          >
            <MotorbikeIconSvg className="w-4 h-4" />
            <span>Ejemplo Lima</span>
          </button>

          <button
            type="button"
            onClick={setQuickCustomerProvinciaExample}
            className="bg-[#61564A] hover:bg-[#A59B8F] hover:text-[#161716] text-[#E4DFD7] px-3 py-1.5 rounded-xl text-xs font-bold border border-[#A59B8F]/30 flex items-center space-x-1 transition-all cursor-pointer"
          >
            <PackageBoxIconSvg className="w-4 h-4" />
            <span>Ejemplo Provincia</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Catalog POS & Right Cart/Customer Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: PUSH BUTTONS & PRODUCT TILES (7-8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          
          {/* SECTION 1: BARCODE / SKU FAST SCANNER */}
          <div className="bg-[#161716] text-[#E4DFD7] rounded-xl p-3 border border-[#61564A]/50 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#A59B8F] uppercase tracking-wider">
              <span className="flex items-center space-x-1.5">
                <Scan className="w-3.5 h-3.5 text-amber-400" />
                <span>LECTOR RÁPIDO DE CÓDIGO BARRA / SKU</span>
              </span>
              <span className="text-[9px] text-[#A59B8F]/80">Escribe o escanea SKU + Enter</span>
            </div>

            <form onSubmit={handleScanSkuSubmit} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Scan className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={skuScanInput}
                  onChange={(e) => setSkuScanInput(e.target.value)}
                  placeholder="Escanear o ingresar SKU (ej: ART-001, COL-002)..."
                  className="w-full bg-[#24211E] border border-[#61564A] text-[#E4DFD7] rounded-lg pl-8 pr-2.5 py-1.5 text-xs font-mono font-bold focus:outline-none focus:border-amber-400 placeholder-[#A59B8F]/50"
                />
              </div>

              <button
                type="submit"
                className="bg-[#61564A] hover:bg-[#A59B8F] text-[#161716] font-black text-xs px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer shrink-0 border border-[#A59B8F]"
              >
                + AGREGAR SKU
              </button>
            </form>

            {/* Scan Alert Message */}
            {scanMessage && (
              <div className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all ${
                scanMessage.type === 'success' ? 'bg-emerald-950 text-emerald-200 border border-emerald-800' : 'bg-red-950 text-red-200 border border-red-800'
              }`}>
                <span>{scanMessage.text}</span>
              </div>
            )}
          </div>

          {/* SECTION 2: CATEGORY PUSH BUTTONS */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#61564A]" />
                <span className="uppercase tracking-wider text-[11px]">SECCIONES DE JOYERÍA (BOTONES PUSH)</span>
              </span>
              <span className="text-[10px] text-slate-400">Toca para filtrar</span>
            </div>

            {/* Category Push Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`p-2 rounded-lg font-extrabold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition-all cursor-pointer active:scale-95 border ${
                  activeCategory === 'all'
                    ? 'bg-[#161716] text-[#E4DFD7] border-[#61564A] shadow-xs ring-2 ring-[#61564A]/50'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <Gem className="w-4 h-4 text-[#A59B8F]" />
                <span>TODAS</span>
              </button>

              {categoriesList.map((cat) => {
                const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
                const count = products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat.toLowerCase())}
                    className={`p-1.5 rounded-lg font-bold text-[10px] flex flex-col items-center justify-center space-y-0.5 transition-all cursor-pointer active:scale-95 border ${
                      isSelected
                        ? 'bg-[#61564A] text-[#E4DFD7] border-[#A59B8F] shadow-xs ring-2 ring-[#61564A]/50'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <span className="uppercase tracking-wide truncate max-w-full">{cat}</span>
                    <span className={`px-1 py-0.2 rounded-full text-[8px] font-bold ${
                      isSelected ? 'bg-[#161716] text-[#E4DFD7]' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {count} un.
                    </span>
                  </button>
                );
              })}

            </div>

            {/* Secondary Metal Filters & Search */}
            <div className="pt-1.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center space-x-1 w-full sm:w-auto">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Ley:</span>
                <button
                  type="button"
                  onClick={() => setMetalFilter('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer border ${
                    metalFilter === 'all' ? 'bg-[#161716] text-white border-black' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setMetalFilter('950')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer border ${
                    metalFilter === '950' ? 'bg-[#61564A] text-white border-[#61564A]' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Plata 950
                </button>
                <button
                  type="button"
                  onClick={() => setMetalFilter('925')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer border ${
                    metalFilter === '925' ? 'bg-[#61564A] text-white border-[#61564A]' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  Plata 925
                </button>
              </div>

              <div className="relative w-full sm:w-48">
                <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar joya o SKU..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#61564A]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PRODUCT TILES GRID (Max Height Scrollable) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const inCartItem = cartItems.find((ci) => ci.product.id === p.id);
              const isOutStock = p.stock <= 0;

              return (
                <div
                  key={p.id}
                  className={`group relative bg-white border rounded-xl p-2.5 flex flex-col justify-between shadow-xs transition-all overflow-hidden hover:shadow-md hover:-translate-y-0.5 hover:border-[#61564A] ${
                    inCartItem ? 'border-[#61564A] ring-2 ring-[#61564A]/30 bg-amber-50/20' : 'border-slate-200'
                  } ${isOutStock ? 'opacity-90' : ''}`}
                >
                  {/* Top accent gradient */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-[#161716] via-[#61564A] to-[#A59B8F] opacity-70" />

                  {/* Metal Badge */}
                  <div className="flex items-center justify-between gap-1 mb-1.5 pt-1">
                    <span className="font-mono text-[9px] text-blue-600 font-bold bg-blue-50/80 px-1.5 py-0.5 rounded border border-blue-100">
                      {p.sku}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                      inCartItem
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-[#E4DFD7] text-[#161716] border-[#61564A]/20'
                    }`}>
                      {p.name.includes('925') ? 'Plata 925' : 'Plata 950'}
                    </span>
                  </div>

                  {/* Title + Stock (stock next to product name) */}
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <h3 className="font-bold text-[11px] text-slate-900 leading-snug line-clamp-2 flex-1">
                      {p.name}
                    </h3>
                    <span className={`text-[8px] font-bold inline-flex items-center space-x-0.5 shrink-0 mt-0.5 ${
                      isOutStock ? 'text-red-500' : 'text-emerald-600'
                    }`}>
                      {inCartItem && !isOutStock && (
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      )}
                      <span>{isOutStock ? 'Agotado' : `Stock: ${p.stock}`}</span>
                    </span>
                  </div>

                  {/* Price + Add Button (ADD button next to price) */}
                  <div>
                    {isOutStock ? (
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          S/ {p.price.toFixed(2)}
                        </span>
                        <span className="w-full max-w-[86px] bg-slate-100 text-slate-400 text-[8px] font-bold py-0.5 rounded-md border border-slate-200 text-center cursor-not-allowed">
                          Agotado
                        </span>
                      </div>
                    ) : inCartItem ? (
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-black text-[#161716] bg-gradient-to-br from-slate-50 to-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          S/ {p.price.toFixed(2)}
                        </span>
                        <div className="flex items-center bg-[#161716] text-[#E4DFD7] rounded-md p-0.5 shadow-xs shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(p.id, -1)}
                            className="w-5 h-5 bg-[#61564A] hover:bg-[#A59B8F] hover:text-[#161716] rounded flex items-center justify-center font-bold text-white transition-colors cursor-pointer active:scale-90"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>

                          <span className="font-extrabold text-[10px] px-1">
                            {inCartItem.quantity} un.
                          </span>

                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(p.id, 1)}
                            className="w-5 h-5 bg-[#61564A] hover:bg-[#A59B8F] hover:text-[#161716] rounded flex items-center justify-center font-bold text-white transition-colors cursor-pointer active:scale-90"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-black text-[#161716] bg-gradient-to-br from-slate-50 to-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          S/ {p.price.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(p)}
                          className="bg-[#161716] hover:bg-[#61564A] text-[#E4DFD7] text-[8px] font-extrabold py-1 px-1.5 rounded-md border border-[#61564A]/50 shadow-xs transition-all active:scale-95 flex items-center space-x-0.5 cursor-pointer shrink-0"
                        >
                          <Plus className="w-2.5 h-2.5 text-[#A59B8F]" />
                          <span>AGREGAR</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: SALES CART & TABBED CUSTOMER/PAYMENT FORM (Sticky & Ultra Compact) */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-4">
          
          <form onSubmit={handleGenerateReceipt} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-md space-y-2.5">
            
            {/* Header Cart */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <div className="flex items-center space-x-1.5">
                <ShoppingBag className="w-4 h-4 text-[#61564A]" />
                <h2 className="font-black text-xs uppercase tracking-wider text-slate-900">
                  Resumen Venta ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                </h2>
              </div>

              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-[9px] font-semibold text-red-600 hover:text-red-800 flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Vaciar</span>
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-1 max-h-28 overflow-y-auto pr-1 border-b border-slate-100 pb-1.5">
              {cartItems.length === 0 ? (
                <div className="py-2 text-center text-slate-400 space-y-0.5">
                  <ShoppingBag className="w-5 h-5 mx-auto text-slate-300" />
                  <p className="text-[11px] font-semibold text-slate-500">
                    Carrito vacío.
                  </p>
                </div>
              ) : (
                cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-1.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex-1 pr-1">
                      <p className="font-bold text-slate-900 line-clamp-1 text-[10px]">{product.name}</p>
                      <p className="text-[8px] text-slate-500">
                        S/ {product.price.toFixed(2)} c/u · <span className="font-mono text-blue-600">{product.sku}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <div className="flex items-center bg-white border border-slate-200 rounded p-0.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(product.id, -1)}
                          className="w-3.5 h-3.5 text-slate-600 hover:bg-slate-100 rounded flex items-center justify-center font-bold text-[10px]"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-bold text-[10px]">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(product.id, 1)}
                          className="w-3.5 h-3.5 text-slate-600 hover:bg-slate-100 rounded flex items-center justify-center font-bold text-[10px]"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-black text-slate-900 w-12 text-right text-[10px]">
                        S/ {(product.price * quantity).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(product.id)}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* SUB-TAB SWITCHER: CLIENTE vs PAGO & TOTALES */}
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setRightPanelTab('cliente_envio')}
                className={`py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  rightPanelTab === 'cliente_envio'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-3 h-3 text-[#61564A]" />
                <span>1. Cliente & Envío</span>
                {customerName.trim() && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
              </button>

              <button
                type="button"
                onClick={() => setRightPanelTab('pago_totales')}
                className={`py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                  rightPanelTab === 'pago_totales'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CreditCard className="w-3 h-3 text-[#61564A]" />
                <span>2. Pago & Totales</span>
              </button>
            </div>

            {/* TAB CONTENT 1: CLIENTE Y ENVÍO */}
            {rightPanelTab === 'cliente_envio' && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[#61564A] uppercase tracking-wider">
                    Datos del Comprador
                  </span>

                  {/* Quick Presets */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={setQuickCustomerLimaExample}
                      className="text-[9px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer border border-slate-200"
                    >
                      🛵 Lima
                    </button>
                    <button
                      type="button"
                      onClick={setQuickCustomerProvinciaExample}
                      className="text-[9px] font-bold text-[#61564A] bg-[#E4DFD7] hover:bg-[#A59B8F]/30 px-1.5 py-0.5 rounded cursor-pointer border border-[#61564A]/30"
                    >
                      📦 Provincia
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-1.5">
                  <div className="col-span-7">
                    <label className="text-[8px] font-bold text-slate-600 uppercase block">Nombre Cliente *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. María López"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-[#61564A]"
                    />
                  </div>
                  <div className="col-span-5">
                    <label className="text-[8px] font-bold text-slate-600 uppercase block">DNI / RUC</label>
                    <input
                      type="text"
                      value={customerDoc}
                      onChange={(e) => setCustomerDoc(e.target.value)}
                      placeholder="47985621"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-[#61564A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="text-[8px] font-bold text-slate-600 uppercase block">Teléfono</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="987 654 321"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-600 uppercase block">Correo</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="cliente@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Delivery Pills */}
                <div className="pt-1 border-t border-slate-100 space-y-1">
                  <span className="text-[8px] font-bold text-slate-500 uppercase block">Modalidad de Envío</span>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryType('express');
                        setSelectedProvince('Lima');
                        setShippingAgency('Motorizado');
                      }}
                      className={`py-1 px-1 rounded-lg text-center border text-[9px] font-bold cursor-pointer transition-all ${
                        deliveryType === 'express' ? 'bg-[#61564A] text-white border-[#61564A]' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      🛵 Lima (S/10)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryType('provincia');
                        if (selectedProvince === 'Lima') setSelectedProvince('Cusco');
                        setShippingAgency('Agencia (Shalom/Olva)');
                      }}
                      className={`py-1 px-1 rounded-lg text-center border text-[9px] font-bold cursor-pointer transition-all ${
                        deliveryType === 'provincia' ? 'bg-[#61564A] text-white border-[#61564A]' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      📦 Prov (S/18)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryType('tienda');
                        setSelectedProvince('Lima');
                        setShippingAgency('Recojo en Tienda');
                      }}
                      className={`py-1 px-1 rounded-lg text-center border text-[9px] font-bold cursor-pointer transition-all ${
                        deliveryType === 'tienda' ? 'bg-[#61564A] text-white border-[#61564A]' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      🏬 Tienda (S/0)
                    </button>
                  </div>
                </div>

                {/* Destination Inputs */}
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="text-[8px] font-bold text-slate-500 uppercase block">Ciudad/Provincia</label>
                    <input
                      type="text"
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      placeholder="Lima, Cusco..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-500 uppercase block">Distrito</label>
                    <input
                      type="text"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      placeholder="Lince, Wanchaq..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="text-[8px] font-bold text-slate-500 uppercase block">Dirección</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Av. Arequipa 1234..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-500 uppercase block">Referencia</label>
                    <input
                      type="text"
                      value={customerReference}
                      onChange={(e) => setCustomerReference(e.target.value)}
                      placeholder="Alt. Cdra 12"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                {/* Coordenadas GPS Input Field */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[8px] font-bold text-slate-600 uppercase flex items-center space-x-1">
                      <MapPin className="w-2.5 h-2.5 text-amber-600" />
                      <span>Coordenadas GPS / Google Maps</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsMapModalOpen(true)}
                      className="text-[9px] font-extrabold text-blue-600 hover:text-blue-800 flex items-center space-x-0.5 cursor-pointer"
                    >
                      <span>🗺️ Buscar en Mapa</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={customerCoords ? `${customerCoords.lat.toFixed(6)}, ${customerCoords.lng.toFixed(6)}` : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const coordsRegex = /(-?\d{1,2}\.\d+)\s*[\s,;:\/]\s*(-?\d{1,3}\.\d+)/;
                        const match = val.match(coordsRegex);
                        if (match) {
                          const lat = parseFloat(match[1]);
                          const lng = parseFloat(match[2]);
                          if (!isNaN(lat) && !isNaN(lng)) {
                            setCustomerCoords({ lat, lng });
                          }
                        } else if (!val.trim()) {
                          setCustomerCoords(null);
                        }
                      }}
                      placeholder="Pegar ej: -12.0894, -77.0335 o link Maps"
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                    {customerCoords && (
                      <a
                        href={`https://www.google.com/maps?q=${customerCoords.lat},${customerCoords.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] text-blue-600 hover:underline font-bold shrink-0 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                      >
                        Maps ↗
                      </a>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setRightPanelTab('pago_totales')}
                  className="w-full mt-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold py-1 rounded-lg border border-slate-300 text-center cursor-pointer"
                >
                  Continuar a Pago & Totales ➔
                </button>
              </div>
            )}

            {/* TAB CONTENT 2: PAGO Y TOTALES */}
            {rightPanelTab === 'pago_totales' && (
              <div className="space-y-2 animate-fadeIn">
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="text-[8px] font-bold text-slate-600 uppercase block">
                      Método Pago
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-1.5 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="Yape/Plin">Yape / Plin (QR)</option>
                      <option value="Tarjeta (Visa/MC)">Tarjeta POS Visa</option>
                      <option value="Transferencia BCP/Interbank">Transferencia BCP/Interbank</option>
                      <option value="Efectivo / Contraentrega">Efectivo / Contraentrega</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[8px] font-bold text-[#61564A] uppercase block">
                      Monto Adelanto (S/)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={adelantoAmount || ''}
                      onChange={(e) => setAdelantoAmount(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full bg-[#E4DFD7]/50 border border-[#61564A]/40 text-right px-1.5 py-0.5 rounded-md text-xs font-mono font-bold text-[#161716] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Discounts */}
                <div className="bg-slate-50 border border-slate-200 p-2 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-[9px] text-slate-600">
                    <span className="font-bold uppercase">Descuento:</span>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => applyPercentDiscount(5)}
                        className="bg-white hover:bg-slate-200 text-slate-800 text-[8px] font-bold px-1 py-0.5 rounded border border-slate-300 cursor-pointer"
                      >
                        5%
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPercentDiscount(10)}
                        className="bg-white hover:bg-slate-200 text-slate-800 text-[8px] font-bold px-1 py-0.5 rounded border border-slate-300 cursor-pointer"
                      >
                        10%
                      </button>
                      <button
                        type="button"
                        onClick={() => applyFixedDiscount(10)}
                        className="bg-white hover:bg-slate-200 text-slate-800 text-[8px] font-bold px-1 py-0.5 rounded border border-slate-300 cursor-pointer"
                      >
                        S/10
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscount(0)}
                        className="bg-white hover:bg-slate-200 text-slate-500 text-[8px] font-bold px-1 py-0.5 rounded border border-slate-300 cursor-pointer"
                      >
                        0
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-12 bg-white border border-slate-300 text-right px-1 py-0.5 rounded text-[10px] font-mono focus:outline-none ml-0.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Subtotal & Fee Breakdown */}
                <div className="text-[10px] text-slate-600 space-y-0.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="flex justify-between">
                    <span>Subtotal Joyas:</span>
                    <span className="font-mono font-bold">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío ({shippingAgency}):</span>
                    <span className="font-mono font-bold">S/ {shippingFee.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-amber-700 font-bold">
                      <span>Descuento:</span>
                      <span className="font-mono">- S/ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  {adelantoAmount > 0 && (
                    <div className="flex justify-between text-blue-700 font-bold border-t border-slate-200 pt-0.5">
                      <span>Saldo Pendiente:</span>
                      <span className="font-mono">S/ {(total - adelantoAmount > 0 ? total - adelantoAmount : 0).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FIXED TOTAL SUMMARY & SUBMIT BUTTON (Always visible regardless of tab) */}
            <div className="bg-[#161716] text-[#E4DFD7] p-2.5 rounded-xl space-y-1.5 mt-2 shadow-inner">
              <div className="flex justify-between items-baseline">
                <span className="font-black text-[10px] uppercase tracking-wider text-[#E4DFD7]">TOTAL A PAGAR:</span>
                <span className="font-black text-lg text-[#E4DFD7] font-mono">
                  S/ {total.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className={`w-full py-2 px-3 rounded-lg font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-md cursor-pointer ${
                  cartItems.length === 0 || isSubmitting
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                    : 'bg-[#61564A] hover:bg-[#A59B8F] text-[#161716] border border-[#A59B8F] active:scale-95'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'PROCESANDO...' : 'GENERAR NOTA DE VENTA'}</span>
              </button>
            </div>

          </form>

        </div>

      </div>

      {/* MODAL: NOTA DE VENTA CON DISEÑO EXACTO A LA IMAGEN MOCKUP */}
      {generatedReceipt && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto backdrop-blur-xs">
          
          <div className="bg-[#24211E] rounded-2xl max-w-4xl w-full p-4 sm:p-6 space-y-4 border border-[#61564A] shadow-2xl relative my-6 text-[#E4DFD7]">
            
            {/* Header Tab Switcher & Close */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#61564A]/50 pb-3 gap-3 pr-8">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#E4DFD7] flex items-center space-x-2">
                  <ObsidianaLogoSvg className="w-5 h-5 text-[#A59B8F]" />
                  <span>PLANTILLA NOTA DE VENTA DE OFICINA</span>
                </span>
                <p className="text-[10px] text-[#A59B8F]">
                  Selecciona la variante para visualizar e imprimir en formato vector oficial.
                </p>
              </div>

              {/* Template Variant Tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-[#161716] p-1 rounded-xl border border-[#61564A]">
                <button
                  type="button"
                  onClick={() => setReceiptTab('lima')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                    receiptTab === 'lima' ? 'bg-[#61564A] text-[#E4DFD7] shadow-xs' : 'text-[#A59B8F] hover:text-[#E4DFD7]'
                  }`}
                >
                  <MotorbikeIconSvg className="w-3.5 h-3.5" />
                  <span>Nota Lima</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReceiptTab('provincia')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                    receiptTab === 'provincia' ? 'bg-[#61564A] text-[#E4DFD7] shadow-xs' : 'text-[#A59B8F] hover:text-[#E4DFD7]'
                  }`}
                >
                  <PackageBoxIconSvg className="w-3.5 h-3.5" />
                  <span>Nota Provincia</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReceiptTab('cliente_frente')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                    receiptTab === 'cliente_frente' ? 'bg-[#61564A] text-[#E4DFD7] shadow-xs' : 'text-[#A59B8F] hover:text-[#E4DFD7]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Ficha Frente</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReceiptTab('cliente_reverso')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                    receiptTab === 'cliente_reverso' ? 'bg-[#61564A] text-[#E4DFD7] shadow-xs' : 'text-[#A59B8F] hover:text-[#E4DFD7]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ficha Reverso</span>
                </button>
              </div>

              <button
                onClick={() => setGeneratedReceipt(null)}
                className="absolute top-4 right-4 p-2 text-[#A59B8F] hover:text-[#E4DFD7] rounded-lg bg-[#161716] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PRINTABLE AREA CONTAINING EXACT VECTOR TEMPLATES */}
            <div id="printable-receipt" className="bg-white text-slate-900 rounded-xl p-4 sm:p-6 shadow-inner font-sans overflow-x-auto">
              
              {/* VARIANT 1: NOTA DE VENTA LIMA (EXACT MATCH TO MOCKUP 1) */}
              {(receiptTab === 'lima' || receiptTab === 'todas') && (
                <div className="max-w-2xl mx-auto space-y-4 border border-slate-300 p-4 bg-white text-slate-900">
                  
                  {/* Top Banner Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <ObsidianaLogoSvg className="w-12 h-12 text-[#161716]" />
                      <div>
                        <h1 className="font-serif font-black text-2xl tracking-widest text-[#161716] uppercase leading-none">
                          OBSIDIANA
                        </h1>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-1">
                          JOYERÍA EN PLATA 925/950
                        </p>
                      </div>
                    </div>

                    {/* Black Header Tag Box */}
                    <div className="bg-[#161716] text-[#E4DFD7] px-4 py-2 rounded-t-lg text-right font-sans">
                      <p className="text-[10px] font-bold tracking-widest uppercase">NOTA DE VENTA</p>
                      <p className="text-xs font-black text-white font-mono mt-0.5">{generatedReceipt.receiptNumber}</p>
                      <p className="text-[9px] text-[#A59B8F] font-bold">FECHA: {generatedReceipt.date}</p>
                    </div>
                  </div>

                  {/* DATOS DEL CLIENTE Box Grid */}
                  <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                    
                    {/* Header Bar */}
                    <div className="bg-[#E4DFD7] px-3 py-1 font-extrabold text-[11px] text-[#161716] uppercase tracking-wider border-b border-slate-300">
                      DATOS DEL CLIENTE
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3">
                      {/* Left Details (8 cols) */}
                      <div className="md:col-span-7 space-y-1 text-[11px] text-slate-800">
                        <div className="flex items-baseline space-x-1">
                          <User className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-bold uppercase text-[10px] text-slate-600">NOMBRE:</span>
                          <span className="font-bold text-slate-900">{generatedReceipt.customer.name}</span>
                        </div>

                        <div className="flex items-baseline space-x-1">
                          <CreditCard className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-bold uppercase text-[10px] text-slate-600">DNI / RUC:</span>
                          <span className="font-mono font-bold">{generatedReceipt.customer.doc}</span>
                        </div>

                        <div className="flex items-baseline space-x-1">
                          <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-bold uppercase text-[10px] text-slate-600">TELÉFONO:</span>
                          <span className="font-medium">{generatedReceipt.customer.phone}</span>
                        </div>

                        <div className="flex items-baseline space-x-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-bold uppercase text-[10px] text-slate-600">DIRECCIÓN (ENVÍO):</span>
                          <span className="font-medium truncate">{generatedReceipt.customer.address}</span>
                        </div>

                        <div className="flex items-baseline space-x-1">
                          <Tag className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-bold uppercase text-[10px] text-slate-600">REFERENCIA:</span>
                          <span className="font-medium text-slate-700">{generatedReceipt.customer.reference}</span>
                        </div>

                        {generatedReceipt.customer.coords && (
                          <div className="flex items-center space-x-1 pt-0.5 text-amber-800 font-mono text-[10px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300">
                            <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                            <span className="font-bold">GPS: {generatedReceipt.customer.coords.lat.toFixed(5)}, {generatedReceipt.customer.coords.lng.toFixed(5)}</span>
                            <a
                              href={`https://www.google.com/maps?q=${generatedReceipt.customer.coords.lat},${generatedReceipt.customer.coords.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline font-sans text-[9px] font-bold ml-1"
                            >
                              Maps ↗
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Right Badge Card (5 cols) */}
                      <div className="md:col-span-5 bg-[#E4DFD7]/60 rounded-xl p-2.5 border border-[#61564A]/20 flex flex-col justify-between text-[10px]">
                        <div className="flex items-center space-x-2 border-b border-[#61564A]/20 pb-1.5">
                          <MotorbikeIconSvg className="w-5 h-5 text-[#161716]" />
                          <span className="font-black text-xs text-[#161716] uppercase tracking-wider">
                            ENVÍO: LIMA
                          </span>
                        </div>

                        <div className="space-y-1 pt-1.5 text-slate-800 font-semibold">
                          <p><strong>MODO DE ENVÍO:</strong> Motorizado</p>
                          <p><strong>ADELANTO:</strong> S/ {generatedReceipt.adelanto.toFixed(2)}</p>
                          <p><strong>SALDO:</strong> <span className="font-bold text-red-600">{generatedReceipt.saldoTexto}</span></p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Items Table */}
                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#61564A] text-white text-[10px] font-black uppercase tracking-wider">
                          <th className="py-1.5 px-2 text-center w-12 border-r border-slate-500">CANT.</th>
                          <th className="py-1.5 px-3 border-r border-slate-500">PRODUCTO</th>
                          <th className="py-1.5 px-2 text-center border-r border-slate-500">MATERIAL</th>
                          <th className="py-1.5 px-2 text-right border-r border-slate-500">PRECIO UNIT.</th>
                          <th className="py-1.5 px-3 text-right">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-[11px]">
                        {generatedReceipt.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2 text-center font-bold border-r border-slate-200">{item.quantity}</td>
                            <td className="py-1.5 px-3 font-medium text-slate-900 border-r border-slate-200">{item.productName}</td>
                            <td className="py-1.5 px-2 text-center font-bold text-[#61564A] border-r border-slate-200">{item.material || 'Plata 950'}</td>
                            <td className="py-1.5 px-2 text-right font-mono border-r border-slate-200">S/ {item.unitPrice.toFixed(2)}</td>
                            <td className="py-1.5 px-3 text-right font-bold font-mono">S/ {item.total.toFixed(2)}</td>
                          </tr>
                        ))}

                        {/* Blank Rows for Form Table Structure */}
                        {Array.from({ length: Math.max(0, 5 - generatedReceipt.items.length) }).map((_, i) => (
                          <tr key={`blank-${i}`} className="h-6">
                            <td className="border-r border-slate-200"></td>
                            <td className="border-r border-slate-200"></td>
                            <td className="border-r border-slate-200"></td>
                            <td className="border-r border-slate-200"></td>
                            <td></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Observations & Total Box */}
                  <div className="grid grid-cols-12 gap-3 text-xs">
                    <div className="col-span-7 border border-slate-300 rounded-lg p-2.5 bg-slate-50 space-y-1">
                      <p className="font-extrabold text-[10px] text-[#161716] uppercase tracking-wider">OBSERVACIONES</p>
                      <p className="text-[11px] text-slate-700 leading-tight">
                        Entrega estimada: El mismo día (máx. 24 horas). Garantía de por vida en autenticidad de Ley Plata 950 / 925.
                      </p>
                    </div>

                    <div className="col-span-5 border border-slate-300 rounded-lg overflow-hidden flex flex-col justify-between">
                      <div className="bg-[#E4DFD7] px-3 py-1 font-extrabold text-[10px] text-[#161716] text-center uppercase tracking-wider">
                        TOTAL A PAGAR
                      </div>
                      <div className="p-3 text-center bg-white font-black font-mono text-xl text-[#161716]">
                        S/ {generatedReceipt.total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Thank You Banner */}
                  <div className="bg-[#E4DFD7] py-1.5 text-center font-bold text-xs text-[#161716] uppercase tracking-widest rounded-md">
                    ¡GRACIAS POR TU COMPRA!
                  </div>

                  {/* Contact Social Bar */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 px-2 pt-1 border-t border-slate-200">
                    <span className="flex items-center space-x-1">
                      <Instagram className="w-3 h-3 text-[#161716]" />
                      <span>obsidiana.joyeria</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-[#161716]" />
                      <span>987 654 321</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#161716]" />
                      <span>Lima, Perú</span>
                    </span>
                  </div>

                  {/* Scissor Cut Tear-Off Voucher Stub */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-mono">
                      <Scissors className="w-4 h-4 text-slate-600 shrink-0" />
                      <div className="border-b-2 border-dashed border-slate-400 flex-1"></div>
                    </div>

                    <div className="border border-slate-300 rounded-xl p-3 bg-slate-50 flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center space-x-2">
                        <ObsidianaLogoSvg className="w-8 h-8 text-[#161716]" />
                        <div>
                          <p className="font-serif font-black text-sm text-[#161716] uppercase">OBSIDIANA</p>
                          <p className="text-[9px] font-bold text-slate-500">NOTA DE VENTA</p>
                          <p className="text-[10px] font-extrabold text-red-600 font-mono">{generatedReceipt.receiptNumber}</p>
                          <p className="text-[8px] text-slate-400">FECHA: {generatedReceipt.date}</p>
                        </div>
                      </div>

                      <div className="space-y-0.5 text-[10px] text-slate-800">
                        <p><strong>NOMBRE:</strong> {generatedReceipt.customer.name}</p>
                        <p><strong>TOTAL:</strong> <span className="font-bold font-mono">S/ {generatedReceipt.total.toFixed(2)}</span></p>
                        <p><strong>ADELANTO:</strong> <span className="font-bold font-mono">S/ {generatedReceipt.adelanto.toFixed(2)}</span></p>
                        <p><strong>SALDO:</strong> <span className="font-bold text-red-600">{generatedReceipt.saldoTexto}</span></p>
                      </div>

                      <div className="bg-[#E4DFD7] p-2 rounded-xl text-center border border-[#61564A]/20">
                        <MotorbikeIconSvg className="w-6 h-6 mx-auto text-[#161716]" />
                        <span className="font-black text-[9px] text-[#161716] uppercase block mt-1">LIMA MOTORIZADO</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-center text-slate-500 font-medium">
                      Conserva este comprobante como constancia de tu compra.
                    </p>
                  </div>

                </div>
              )}

              {/* VARIANT 2: NOTA DE VENTA PROVINCIA (EXACT MATCH TO MOCKUP 2) */}
              {receiptTab === 'provincia' && (
                <div className="max-w-2xl mx-auto space-y-4 border border-slate-300 p-4 bg-white text-slate-900">
                  
                  {/* Top Banner Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <ObsidianaLogoSvg className="w-12 h-12 text-[#161716]" />
                      <div>
                        <h1 className="font-serif font-black text-2xl tracking-widest text-[#161716] uppercase leading-none">
                          OBSIDIANA
                        </h1>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mt-1">
                          JOYERÍA EN PLATA 925/950
                        </p>
                      </div>
                    </div>

                    {/* Black Header Tag Box */}
                    <div className="bg-[#161716] text-[#E4DFD7] px-4 py-2 rounded-t-lg text-right font-sans">
                      <p className="text-[10px] font-bold tracking-widest uppercase">NOTA DE VENTA</p>
                      <p className="text-xs font-black text-white font-mono mt-0.5">{generatedReceipt.receiptNumber}</p>
                      <p className="text-[9px] text-[#A59B8F] font-bold">FECHA: {generatedReceipt.date}</p>
                    </div>
                  </div>

                  {/* DATOS DEL CLIENTE Box Grid */}
                  <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                    
                    {/* Header Bar */}
                    <div className="bg-[#E4DFD7] px-3 py-1 font-extrabold text-[11px] text-[#161716] uppercase tracking-wider border-b border-slate-300">
                      DATOS DEL CLIENTE
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3">
                      {/* Left Details (7 cols) */}
                      <div className="md:col-span-7 space-y-1 text-[11px] text-slate-800">
                        <div className="flex items-baseline space-x-1">
                          <User className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-bold uppercase text-[10px] text-slate-600">NOMBRE:</span>
                          <span className="font-bold text-slate-900">{generatedReceipt.customer.name}</span>
                        </div>

                        <div className="flex items-baseline space-x-1">
                          <CreditCard className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-bold uppercase text-[10px] text-slate-600">DNI / RUC:</span>
                          <span className="font-mono font-bold">{generatedReceipt.customer.doc}</span>
                        </div>

                        <div className="flex items-baseline space-x-1">
                          <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-bold uppercase text-[10px] text-slate-600">TELÉFONO:</span>
                          <span className="font-medium">{generatedReceipt.customer.phone}</span>
                        </div>

                        <div className="flex items-baseline space-x-1">
                          <Building className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-bold uppercase text-[10px] text-slate-600">CIUDAD / PROVINCIA:</span>
                          <span className="font-bold text-[#61564A]">{generatedReceipt.customer.province} - {generatedReceipt.customer.district}</span>
                        </div>

                        <div className="flex items-baseline space-x-1">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-bold uppercase text-[10px] text-slate-600">DIRECCIÓN:</span>
                          <span className="font-medium truncate">{generatedReceipt.customer.address}</span>
                        </div>

                        <div className="flex items-baseline space-x-1">
                          <Tag className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="font-bold uppercase text-[10px] text-slate-600">REFERENCIA:</span>
                          <span className="font-medium text-slate-700">{generatedReceipt.customer.reference}</span>
                        </div>
                      </div>

                      {/* Right Badge Card (5 cols) */}
                      <div className="md:col-span-5 bg-[#E4DFD7]/60 rounded-xl p-2.5 border border-[#61564A]/20 flex flex-col justify-between text-[10px]">
                        <div className="flex items-center space-x-2 border-b border-[#61564A]/20 pb-1.5">
                          <PackageBoxIconSvg className="w-5 h-5 text-[#161716]" />
                          <span className="font-black text-xs text-[#161716] uppercase tracking-wider">
                            ENVÍO: PROVINCIA
                          </span>
                        </div>

                        <div className="space-y-1 pt-1.5 text-slate-800 font-semibold">
                          <p><strong>VÍA DE ENVÍO:</strong> Agencia de Transporte</p>
                          <p><strong>ADELANTO:</strong> S/ {generatedReceipt.adelanto.toFixed(2)}</p>
                          <p><strong>SALDO:</strong> <span className="font-bold text-red-600">{generatedReceipt.saldoTexto}</span></p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Items Table */}
                  <div className="border border-slate-300 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#61564A] text-white text-[10px] font-black uppercase tracking-wider">
                          <th className="py-1.5 px-2 text-center w-12 border-r border-slate-500">CANT.</th>
                          <th className="py-1.5 px-3 border-r border-slate-500">PRODUCTO</th>
                          <th className="py-1.5 px-2 text-center border-r border-slate-500">MATERIAL</th>
                          <th className="py-1.5 px-2 text-right border-r border-slate-500">PRECIO UNIT.</th>
                          <th className="py-1.5 px-3 text-right">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-[11px]">
                        {generatedReceipt.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2 text-center font-bold border-r border-slate-200">{item.quantity}</td>
                            <td className="py-1.5 px-3 font-medium text-slate-900 border-r border-slate-200">{item.productName}</td>
                            <td className="py-1.5 px-2 text-center font-bold text-[#61564A] border-r border-slate-200">{item.material || 'Plata 950'}</td>
                            <td className="py-1.5 px-2 text-right font-mono border-r border-slate-200">S/ {item.unitPrice.toFixed(2)}</td>
                            <td className="py-1.5 px-3 text-right font-bold font-mono">S/ {item.total.toFixed(2)}</td>
                          </tr>
                        ))}

                        {/* Blank Rows for Form Table Structure */}
                        {Array.from({ length: Math.max(0, 5 - generatedReceipt.items.length) }).map((_, i) => (
                          <tr key={`blank-${i}`} className="h-6">
                            <td className="border-r border-slate-200"></td>
                            <td className="border-r border-slate-200"></td>
                            <td className="border-r border-slate-200"></td>
                            <td className="border-r border-slate-200"></td>
                            <td></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Observations & Total Box */}
                  <div className="grid grid-cols-12 gap-3 text-xs">
                    <div className="col-span-7 border border-slate-300 rounded-lg p-2.5 bg-slate-50 space-y-1">
                      <p className="font-extrabold text-[10px] text-[#161716] uppercase tracking-wider">OBSERVACIONES</p>
                      <p className="text-[11px] text-slate-700 leading-tight">
                        Despacho vía Shalom / Olva Courier. El saldo se cancela al llegar a la agencia de destino.
                      </p>
                    </div>

                    <div className="col-span-5 border border-slate-300 rounded-lg overflow-hidden flex flex-col justify-between">
                      <div className="bg-[#E4DFD7] px-3 py-1 font-extrabold text-[10px] text-[#161716] text-center uppercase tracking-wider">
                        TOTAL A PAGAR
                      </div>
                      <div className="p-3 text-center bg-white font-black font-mono text-xl text-[#161716]">
                        S/ {generatedReceipt.total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Thank You Banner */}
                  <div className="bg-[#E4DFD7] py-1.5 text-center font-bold text-xs text-[#161716] uppercase tracking-widest rounded-md">
                    ¡GRACIAS POR TU COMPRA!
                  </div>

                  {/* Contact Social Bar */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 px-2 pt-1 border-t border-slate-200">
                    <span className="flex items-center space-x-1">
                      <Instagram className="w-3 h-3 text-[#161716]" />
                      <span>obsidiana.joyeria</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-[#161716]" />
                      <span>987 654 321</span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#161716]" />
                      <span>Lima, Perú</span>
                    </span>
                  </div>

                  {/* Scissor Cut Tear-Off Voucher Stub */}
                  <div className="pt-4 space-y-3">
                    <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-mono">
                      <Scissors className="w-4 h-4 text-slate-600 shrink-0" />
                      <div className="border-b-2 border-dashed border-slate-400 flex-1"></div>
                    </div>

                    <div className="border border-slate-300 rounded-xl p-3 bg-slate-50 flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center space-x-2">
                        <ObsidianaLogoSvg className="w-8 h-8 text-[#161716]" />
                        <div>
                          <p className="font-serif font-black text-sm text-[#161716] uppercase">OBSIDIANA</p>
                          <p className="text-[9px] font-bold text-slate-500">NOTA DE VENTA</p>
                          <p className="text-[10px] font-extrabold text-red-600 font-mono">{generatedReceipt.receiptNumber}</p>
                          <p className="text-[8px] text-slate-400">FECHA: {generatedReceipt.date}</p>
                        </div>
                      </div>

                      <div className="space-y-0.5 text-[10px] text-slate-800">
                        <p><strong>NOMBRE:</strong> {generatedReceipt.customer.name}</p>
                        <p><strong>TOTAL:</strong> <span className="font-bold font-mono">S/ {generatedReceipt.total.toFixed(2)}</span></p>
                        <p><strong>ADELANTO:</strong> <span className="font-bold font-mono">S/ {generatedReceipt.adelanto.toFixed(2)}</span></p>
                        <p><strong>SALDO:</strong> <span className="font-bold text-red-600">{generatedReceipt.saldoTexto}</span></p>
                      </div>

                      <div className="bg-[#E4DFD7] p-2 rounded-xl text-center border border-[#61564A]/20">
                        <PackageBoxIconSvg className="w-6 h-6 mx-auto text-[#161716]" />
                        <span className="font-black text-[9px] text-[#161716] uppercase block mt-1">PROVINCIA AGENCIA</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-center text-slate-500 font-medium">
                      Conserva este comprobante como constancia de tu compra.
                    </p>
                  </div>

                </div>
              )}

              {/* VARIANT 3: REGISTRO DE VENTA - CLIENTES (FRENTE) */}
              {receiptTab === 'cliente_frente' && (
                <div className="max-w-md mx-auto space-y-4 border border-slate-300 rounded-xl overflow-hidden bg-white text-slate-900 shadow-sm">
                  
                  {/* Black Header Bar */}
                  <div className="bg-[#161716] text-[#E4DFD7] px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ObsidianaLogoSvg className="w-7 h-7 text-[#E4DFD7]" />
                      <span className="font-serif font-black tracking-widest text-base">OBSIDIANA</span>
                    </div>

                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#A59B8F]">
                      REGISTRO DE CLIENTE
                    </span>
                  </div>

                  {/* Form Lines */}
                  <div className="p-5 space-y-4 text-xs font-semibold text-slate-800">
                    <div className="flex items-baseline space-x-2">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="uppercase text-[10px] text-slate-600 shrink-0">NOMBRE COMPLETO:</span>
                      <span className="border-b border-slate-400 flex-1 font-bold text-slate-900 px-1">{generatedReceipt.customer.name}</span>
                    </div>

                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-6 flex items-baseline space-x-1">
                        <CreditCard className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="uppercase text-[10px] text-slate-600 shrink-0">DNI:</span>
                        <span className="border-b border-slate-400 flex-1 font-mono px-1">{generatedReceipt.customer.doc}</span>
                      </div>

                      <div className="col-span-6 flex items-baseline space-x-1">
                        <span className="uppercase text-[10px] text-slate-600 shrink-0">FECHA NAC.:</span>
                        <span className="border-b border-slate-400 flex-1 text-center font-mono">__ / __ / ____</span>
                      </div>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="uppercase text-[10px] text-slate-600 shrink-0">TELÉFONO:</span>
                      <span className="border-b border-slate-400 flex-1 px-1">{generatedReceipt.customer.phone}</span>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="uppercase text-[10px] text-slate-600 shrink-0">CORREO ELECTRÓNICO:</span>
                      <span className="border-b border-slate-400 flex-1 px-1">{generatedReceipt.customer.email}</span>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="uppercase text-[10px] text-slate-600 shrink-0">DIRECCIÓN:</span>
                      <span className="border-b border-slate-400 flex-1 px-1 truncate">{generatedReceipt.customer.address}</span>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="uppercase text-[10px] text-slate-600 shrink-0">CIUDAD / PROVINCIA:</span>
                      <span className="border-b border-slate-400 flex-1 px-1">{generatedReceipt.customer.province}</span>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="uppercase text-[10px] text-slate-600 shrink-0">¿CÓMO NOS CONOCISTE?</span>
                      <span className="border-b border-slate-400 flex-1 px-1">Instagram / Recomendación</span>
                    </div>
                  </div>

                  {/* Bottom Beige Message Box */}
                  <div className="bg-[#E4DFD7] p-4 text-center space-y-1">
                    <p className="font-serif italic font-medium text-slate-800 text-sm flex items-center justify-center space-x-1">
                      <Heart className="w-3.5 h-3.5 text-[#61564A] fill-[#61564A]" />
                      <span>Gracias por elegir Obsidiana</span>
                    </p>
                    <p className="text-[11px] text-[#61564A] font-semibold">
                      Tu estilo, nuestra esencia.
                    </p>
                  </div>

                </div>
              )}

              {/* VARIANT 4: REGISTRO DE VENTA - CLIENTES (REVERSO COMPRAS) */}
              {receiptTab === 'cliente_reverso' && (
                <div className="max-w-md mx-auto space-y-3 border border-slate-300 rounded-xl overflow-hidden bg-white text-slate-900 shadow-sm">
                  
                  {/* Taupe Header Bar */}
                  <div className="bg-[#61564A] text-white px-4 py-2.5 text-center">
                    <span className="font-black text-xs uppercase tracking-widest">
                      REGISTRO DE COMPRAS
                    </span>
                  </div>

                  {/* History Table */}
                  <div className="p-3">
                    <table className="w-full text-left text-[10px] border-collapse border border-slate-300">
                      <thead>
                        <tr className="bg-[#E4DFD7] text-[#161716] font-extrabold uppercase">
                          <th className="p-1 border border-slate-300 text-center">FECHA</th>
                          <th className="p-1 border border-slate-300 text-center">N° NOTA</th>
                          <th className="p-1 border border-slate-300">PRODUCTOS</th>
                          <th className="p-1 border border-slate-300 text-right">TOTAL</th>
                          <th className="p-1 border border-slate-300 text-right">ADELANTO</th>
                          <th className="p-1 border border-slate-300 text-right">SALDO</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono">
                        <tr>
                          <td className="p-1 border border-slate-300 text-center">{generatedReceipt.date}</td>
                          <td className="p-1 border border-slate-300 text-center font-bold text-red-600">{generatedReceipt.receiptNumber}</td>
                          <td className="p-1 border border-slate-300 font-sans truncate max-w-[100px]">{generatedReceipt.items[0]?.productName || 'Joya Plata'}</td>
                          <td className="p-1 border border-slate-300 text-right font-bold">S/ {generatedReceipt.total.toFixed(2)}</td>
                          <td className="p-1 border border-slate-300 text-right">S/ {generatedReceipt.adelanto.toFixed(2)}</td>
                          <td className="p-1 border border-slate-300 text-right font-bold text-red-600">S/ {generatedReceipt.saldo.toFixed(2)}</td>
                        </tr>

                        {/* Blank Rows for Stamps */}
                        {Array.from({ length: 6 }).map((_, i) => (
                          <tr key={i} className="h-6">
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                            <td className="border border-slate-300"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Observations & Contact */}
                  <div className="px-3 pb-3 grid grid-cols-12 gap-2 text-[10px]">
                    <div className="col-span-7 border border-slate-300 p-2 rounded bg-slate-50 space-y-1">
                      <p className="font-bold text-slate-700">OBSERVACIONES</p>
                      <div className="border-b border-slate-300 h-3"></div>
                      <div className="border-b border-slate-300 h-3"></div>
                    </div>

                    <div className="col-span-5 bg-[#E4DFD7]/60 border border-[#61564A]/30 p-2 rounded text-[9px] space-y-1 text-slate-800 font-semibold">
                      <p className="flex items-center space-x-1">
                        <Phone className="w-2.5 h-2.5" />
                        <span>987 654 321</span>
                      </p>
                      <p className="flex items-center space-x-1">
                        <Instagram className="w-2.5 h-2.5" />
                        <span>obsidiana.joyeria</span>
                      </p>
                      <p className="flex items-center space-x-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>Lima, Perú</span>
                      </p>
                    </div>
                  </div>

                  {/* Black Footer Tag */}
                  <div className="bg-[#161716] text-[#E4DFD7] py-1.5 text-center text-[9px] font-bold tracking-widest uppercase">
                    💎 PLATA 925 / 950 · AUTÉNTICA · GARANTIZADA
                  </div>

                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="border-t border-[#61564A]/40 pt-4 grid grid-cols-1 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="bg-[#61564A] hover:bg-[#A59B8F] text-white font-bold py-2.5 px-2 rounded-xl text-[11px] flex items-center justify-center space-x-1 transition-all cursor-pointer border border-[#A59B8F]/30"
              >
                <Printer className="w-3.5 h-3.5 text-[#E4DFD7]" />
                <span>Imprimir / PDF</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPackageLabelOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-2 rounded-xl text-[11px] flex items-center justify-center space-x-1 transition-all cursor-pointer shadow-md"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>📦 Rotulado Envío</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-2 rounded-xl text-[11px] flex items-center justify-center space-x-1 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGeneratedReceipt(null);
                  handleClearCart();
                  setCustomerName('');
                  setCustomerDoc('');
                  setCustomerPhone('');
                  setCustomerEmail('');
                  setAdelantoAmount(0);
                  setCustomerCoords(null);
                }}
                className="bg-[#161716] hover:bg-slate-800 text-[#E4DFD7] font-bold py-2.5 px-2 rounded-xl text-[11px] flex items-center justify-center space-x-1 border border-[#61564A] transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Venta</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Google Maps Location Picker Modal */}
      <MapLocationPickerModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        initialCoords={customerCoords}
        initialAddress={customerAddress ? `${customerAddress}, ${selectedDistrict}, ${selectedProvince}` : ''}
        onSelectCoords={(coords) => {
          setCustomerCoords(coords);
        }}
      />

      {/* Package Shipping Label Modal */}
      {generatedReceipt && (
        <PackageShippingLabelModal
          isOpen={isPackageLabelOpen}
          onClose={() => setIsPackageLabelOpen(false)}
          order={{
            id: generatedReceipt.receiptNumber,
            trackingCode: generatedReceipt.receiptNumber,
            customer: {
              name: generatedReceipt.customer.name,
              phone: generatedReceipt.customer.phone,
              email: generatedReceipt.customer.email,
              docNumber: generatedReceipt.customer.doc,
              address: generatedReceipt.customer.address,
              reference: generatedReceipt.customer.reference,
              province: generatedReceipt.customer.province,
              district: generatedReceipt.customer.district,
              coords: generatedReceipt.customer.coords,
            },
            shippingAgency: deliveryType === 'provincia' ? 'SHALOM EXPRESS' : 'MOTORIZADO EXPRESS LIMA',
            deliveryType: deliveryType,
            total: generatedReceipt.total,
            adelanto: generatedReceipt.adelanto,
            saldo: generatedReceipt.saldoTextNumeric !== undefined ? generatedReceipt.saldoTextNumeric : (generatedReceipt.total - generatedReceipt.adelanto),
            items: generatedReceipt.items,
          }}
        />
      )}

    </div>
  );
};

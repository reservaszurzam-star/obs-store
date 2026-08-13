import React, { useState } from 'react';
import { 
  Search, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Package, 
  User, 
  Phone, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Order } from '../types';

interface TrackingModuleProps {
  orders: Order[];
  initialSearchCode?: string;
}

export const TrackingModule: React.FC<TrackingModuleProps> = ({
  orders,
  initialSearchCode = '',
}) => {
  const [trackingCodeInput, setTrackingCodeInput] = useState(initialSearchCode || (orders[0]?.trackingCode || ''));
  const [foundOrder, setFoundOrder] = useState<Order | null>(
    orders.find((o) => o.trackingCode.toUpperCase() === trackingCodeInput.toUpperCase()) || orders[0] || null
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const query = trackingCodeInput.trim().toUpperCase();
    if (!query) return;

    const match = orders.find(
      (o) => o.trackingCode.toUpperCase() === query || o.orderNumber.toUpperCase() === query
    );

    if (match) {
      setFoundOrder(match);
    } else {
      setFoundOrder(null);
      setErrorMsg(`No se encontró ningún pedido con el código "${query}". Verifica el número ingresado.`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Search Header Banner */}
      <div className="bg-white border border-slate-200 p-8 rounded-xl text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 mx-auto">
          <Truck className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Portal de Seguimiento de Pedidos (Tracking)</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
            Ingresa tu código de rastreo (Ej. <span className="font-mono text-blue-600 font-bold">TRK-98412</span> o N° de Pedido) para conocer la ubicación y estado actual de tu envío en Perú.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={trackingCodeInput}
              onChange={(e) => setTrackingCodeInput(e.target.value)}
              placeholder="Ej. TRK-98412 o PED-2026-0091"
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-xs transition-all shrink-0"
          >
            Rastrear
          </button>
        </form>

        {/* Quick Select Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400">Probar códigos demo:</span>
          {orders.slice(0, 4).map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setTrackingCodeInput(o.trackingCode);
                setFoundOrder(o);
                setErrorMsg('');
              }}
              className="bg-slate-50 hover:bg-slate-100 text-blue-600 font-mono px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
            >
              {o.trackingCode}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tracking Result View */}
      {foundOrder && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-8 shadow-xs text-slate-800">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Código de Rastreo</span>
              <h2 className="text-xl font-mono font-extrabold text-slate-900 flex items-center space-x-3">
                <span>{foundOrder.trackingCode}</span>
                <span className="text-xs font-sans font-normal text-slate-400">({foundOrder.orderNumber})</span>
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Tiempo de Entrega Estimado</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center justify-end space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{foundOrder.estimatedDelivery}</span>
                </span>
              </div>
              <div className={`px-4 py-2 rounded-xl font-bold text-xs ${
                foundOrder.status === 'entregado'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : foundOrder.status === 'en_ruta'
                  ? 'bg-purple-50 text-purple-600 border border-purple-200 animate-pulse'
                  : 'bg-blue-50 text-blue-600 border border-blue-200'
              }`}>
                {foundOrder.status.toUpperCase().replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Visual Progress Steps Bar */}
          <div className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {foundOrder.timeline.map((step, index) => {
                const isCompleted = step.completed;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-blue-50/50 border-blue-200 text-slate-800'
                        : 'bg-slate-50/50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {index + 1}
                      </span>
                      {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>

                    <p className="font-bold text-xs line-clamp-1">{step.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{step.description}</p>
                    {step.timestamp && (
                      <p className="text-[10px] text-slate-400 mt-2 font-mono">
                        {new Date(step.timestamp).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier & Destination Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
            
            {/* Courier Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center space-x-1.5">
                <Truck className="w-4 h-4" />
                <span>Información del Transportista</span>
              </h3>

              <div className="space-y-1.5 text-xs text-slate-700">
                <p><strong>Conductor Asignado:</strong> {foundOrder.courier?.driverName || 'Por asignar'}</p>
                <p><strong>Teléfono Repartidor:</strong> {foundOrder.courier?.driverPhone || 'Contacto en ruta'}</p>
                <p><strong>Unidad Móvil:</strong> {foundOrder.courier?.vehicle || 'Furgón de Carga'} ({foundOrder.courier?.licensePlate})</p>
                <p><strong>Empresa Logística:</strong> {foundOrder.customer.zone}</p>
              </div>
            </div>

            {/* Destination Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-4 h-4" />
                <span>Destino de Recepción</span>
              </h3>

              <div className="space-y-1.5 text-xs text-slate-700">
                <p><strong>Consignatario:</strong> {foundOrder.customer.name}</p>
                <p><strong>Dirección:</strong> {foundOrder.customer.address}</p>
                <p><strong>Ubicación:</strong> {foundOrder.customer.district}, {foundOrder.customer.province}</p>
                {foundOrder.customer.notes && (
                  <p className="text-amber-700 text-[11px]"><strong>Notas:</strong> {foundOrder.customer.notes}</p>
                )}
              </div>
            </div>

          </div>

          {/* Order Package Contents Summary */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Package className="w-4 h-4 text-blue-600" />
              <span>Contenido del Paquete</span>
            </h3>

            <div className="divide-y divide-slate-200 text-xs">
              {foundOrder.items.map((i, idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <span className="text-slate-800">{i.productName} (x{i.quantity})</span>
                  <span className="font-mono text-slate-500">SKU: {i.sku}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

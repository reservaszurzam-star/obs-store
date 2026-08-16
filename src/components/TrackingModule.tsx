import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Check, 
  Clock, 
  Package, 
  ChevronRight,
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
    <div className="space-y-12 max-w-4xl mx-auto px-4 py-8 font-sans">
      
      {/* Header Banner - Minimalist */}
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-light tracking-widest text-zinc-900 uppercase">Seguimiento de Envío</h1>
        <p className="text-sm text-zinc-500 font-light max-w-md mx-auto">
          Ingresa tu número de rastreo para conocer el estado actualizado de tu joya.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mt-8 flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={trackingCodeInput}
              onChange={(e) => setTrackingCodeInput(e.target.value)}
              placeholder="N° DE RASTREO O PEDIDO"
              className="w-full bg-transparent border-b border-zinc-300 px-4 py-3 text-sm text-center text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-0 font-mono tracking-widest uppercase transition-colors"
            />
          </div>
          <button
            type="submit"
            className="bg-zinc-900 hover:bg-zinc-800 text-white uppercase tracking-widest text-xs py-4 px-8 w-full transition-colors flex items-center justify-center gap-2"
          >
            <span>Buscar Pedido</span>
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo codes */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setTrackingCodeInput(o.trackingCode);
                setFoundOrder(o);
                setErrorMsg('');
              }}
              className="text-xs text-zinc-400 hover:text-zinc-900 font-mono tracking-wider transition-colors border-b border-transparent hover:border-zinc-900 pb-0.5"
            >
              {o.trackingCode}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-800 text-sm flex items-center justify-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span className="font-light">{errorMsg}</span>
        </div>
      )}

      {/* Result View */}
      {foundOrder && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white border border-zinc-100 p-8 md:p-12 space-y-12">
            
            {/* Summary Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-zinc-100">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Orden Confirmada</span>
                <h2 className="text-2xl font-mono tracking-wider text-zinc-900">
                  {foundOrder.trackingCode}
                </h2>
                <p className="text-sm text-zinc-500 font-light">
                  Destino: {foundOrder.customer.district}, {foundOrder.customer.province}
                </p>
              </div>

              <div className="text-left md:text-right space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">Entrega Estimada</p>
                <div className="flex items-center md:justify-end gap-2 text-zinc-900">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-medium tracking-wide">{foundOrder.estimatedDelivery}</span>
                </div>
                <div className="inline-block px-3 py-1 bg-zinc-100 text-zinc-800 text-xs tracking-wider uppercase mt-2">
                  {foundOrder.status.replace('_', ' ')}
                </div>
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="py-4">
              <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-8">Historial de Envío</h3>
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-zinc-200">
                {foundOrder.timeline.map((step, index) => {
                  const isCompleted = step.completed;
                  const isLastCompleted = isCompleted && (!foundOrder.timeline[index + 1] || !foundOrder.timeline[index + 1].completed);
                  
                  return (
                    <div key={index} className="relative flex items-start md:justify-center">
                      {/* Left Side (Desktop) */}
                      <div className="hidden md:block w-1/2 pr-8 text-right">
                        {step.timestamp && isCompleted ? (
                          <div className="text-xs text-zinc-500 mt-1">
                            <span className="block font-medium text-zinc-900">{new Date(step.timestamp).toLocaleDateString('es-PE')}</span>
                            <span className="font-mono">{new Date(step.timestamp).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">Pendiente</div>
                        )}
                      </div>

                      {/* Icon Center */}
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white z-10 transition-colors duration-500 ${
                          isCompleted ? 'border-zinc-900 text-zinc-900' : 'border-zinc-200 text-transparent'
                        }`}>
                          {isCompleted && <Check className="w-3 h-3" strokeWidth={3} />}
                        </div>
                        {isLastCompleted && (
                          <span className="absolute w-6 h-6 rounded-full border border-zinc-900 animate-ping opacity-20"></span>
                        )}
                      </div>

                      {/* Right Side / Content */}
                      <div className="w-full md:w-1/2 pl-6 md:pl-8">
                        <h4 className={`text-sm font-medium tracking-wide ${isCompleted ? 'text-zinc-900' : 'text-zinc-400'}`}>
                          {step.title}
                        </h4>
                        <p className={`text-xs mt-1.5 leading-relaxed font-light ${isCompleted ? 'text-zinc-600' : 'text-zinc-400'}`}>
                          {step.description}
                        </p>
                        
                        {/* Mobile timestamp */}
                        <div className="md:hidden mt-2">
                           {step.timestamp && isCompleted && (
                             <span className="text-[10px] text-zinc-400 font-mono">
                               {new Date(step.timestamp).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extra Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
              
              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Detalle de Entrega
                </h3>
                <div className="space-y-2 text-sm font-light text-zinc-600">
                  <p><span className="font-medium text-zinc-900">Recibe:</span> {foundOrder.customer.name}</p>
                  <p><span className="font-medium text-zinc-900">Dirección:</span> {foundOrder.customer.address}</p>
                  {foundOrder.courier?.driverName && (
                    <p className="pt-2"><span className="font-medium text-zinc-900">Transporte:</span> {foundOrder.courier.driverName} ({foundOrder.courier.vehicle})</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" /> Artículos
                </h3>
                <ul className="space-y-3">
                  {foundOrder.items.map((i, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm">
                      <span className="font-light text-zinc-600 flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-zinc-300" />
                        {i.productName} <span className="text-zinc-400 text-xs">x{i.quantity}</span>
                      </span>
                      <span className="font-mono text-xs text-zinc-400">{i.sku}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

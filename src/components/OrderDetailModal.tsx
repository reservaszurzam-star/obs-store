import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Mail, 
  User, 
  Phone, 
  Package, 
  Send,
  AlertCircle,
  Tag
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { PackageShippingLabelModal } from './PackageShippingLabelModal';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  onSendTestEmail: (recipientEmail: string, subject: string, bodyHtml: string) => Promise<void>;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onSendTestEmail,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('pendiente');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState('');
  const [isShippingLabelOpen, setIsShippingLabelOpen] = useState(false);

  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setStatusNote('');
      setEmailStatusMsg('');
    }
  }, [order]);

  if (!order) return null;


  const handleStatusChange = async () => {
    setIsUpdating(true);
    setEmailStatusMsg('');
    try {
      await onUpdateStatus(order.id, selectedStatus, statusNote);
      setEmailStatusMsg(`¡Estado actualizado a "${selectedStatus.toUpperCase()}". Correo de notificación enviado al cliente!`);
      setStatusNote('');
    } catch (err: any) {
      setEmailStatusMsg(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 rounded-sm w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl text-zinc-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-sm bg-zinc-100 text-zinc-900 flex items-center justify-center border border-zinc-200 font-bold">
              PED
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-zinc-900">{order.orderNumber}</h2>
                <span className="font-mono text-xs text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  {order.trackingCode}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Registrado el {new Date(order.createdAt).toLocaleString('es-PE')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrintReceipt}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-zinc-50 text-zinc-700 rounded-sm text-xs font-medium border border-zinc-200 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Descargar Nota de Venta</span>
            </button>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 p-2 rounded-sm hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {emailStatusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{emailStatusMsg}</span>
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Customer Box */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-2">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>Cliente</span>
              </span>
              <p className="font-semibold text-zinc-900 text-xs">{order.customer.name}</p>
              <p className="text-xs text-zinc-500 flex items-center space-x-1">
                <Mail className="w-3 h-3 text-zinc-400" />
                <span>{order.customer.email}</span>
              </p>
              <p className="text-xs text-zinc-500 flex items-center space-x-1">
                <Phone className="w-3 h-3 text-zinc-400" />
                <span>{order.customer.phone}</span>
              </p>
            </div>

            {/* Delivery Destination Box */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-2">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Destino de Envío</span>
              </span>
              <p className="font-semibold text-zinc-900 text-xs">
                {order.customer.district}, {order.customer.province}
              </p>
              <p className="text-xs text-zinc-600">{order.customer.address}</p>
              <p className="text-[11px] text-zinc-400">Zona: {order.customer.zone}</p>

              {order.customer.coords && (
                <div className="mt-2 pt-2 border-t border-zinc-200 flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-700 font-medium text-[11px]">
                    📍 {order.customer.coords.lat.toFixed(4)}, {order.customer.coords.lng.toFixed(4)}
                  </span>
                  <a
                    href={`https://www.google.com/maps?q=${order.customer.coords.lat},${order.customer.coords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-900 hover:text-blue-800 font-bold flex items-center space-x-1"
                  >
                    <span>Abrir en Maps</span>
                    <MapPin className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Logistics & Payment */}
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-2">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Logística & Pago</span>
              </span>
              <p className="text-xs text-zinc-700">
                <strong>Pago:</strong> {order.paymentMethod}
              </p>
              <p className="text-xs text-zinc-700">
                <strong>Repartidor:</strong> {order.courier?.driverName || 'Asignado en ruta'}
              </p>
              <p className="text-xs text-zinc-700">
                <strong>Vehículo:</strong> {order.courier?.vehicle || 'N/A'} ({order.courier?.licensePlate || ''})
              </p>
            </div>

          </div>

          {/* Items Table */}
          <div className="border border-zinc-200 rounded-sm overflow-hidden bg-white">
            <div className="px-4 py-2.5 bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-between">
              <span>Productos del Pedido</span>
              <span>Subtotal & Envío</span>
            </div>

            <div className="divide-y divide-zinc-100 p-4 space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-zinc-800">{item.productName}</p>
                    <p className="text-zinc-400">SKU: {item.sku} | Cantidad: {item.quantity} x S/ {item.unitPrice.toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-zinc-900">S/ {item.total.toFixed(2)}</span>
                </div>
              ))}

              <div className="pt-3 border-t border-zinc-200 space-y-1 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal:</span>
                  <span>S/ {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Envío ({order.customer.zone}):</span>
                  <span>S/ {order.shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-zinc-900 pt-1">
                  <span>TOTAL GENERAL:</span>
                  <span>S/ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Update Order Status Control Box */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-sm space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Actualizar Estado del Envío (Notifica al Cliente por Correo)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div>
                <label className="block text-xs text-zinc-600 mb-1">Nuevo Estado</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  className="w-full bg-white border border-zinc-200 rounded-sm px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-900"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_preparacion">En Preparación</option>
                  <option value="en_ruta">En Ruta de Entrega</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-zinc-600 mb-1">Nota o Comentario para el Cliente</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Ej. Entregado al conserje del edificio"
                  className="w-full bg-white border border-zinc-200 rounded-sm px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleStatusChange}
                  disabled={isUpdating}
                  className="w-full bg-zinc-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-sm text-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isUpdating ? 'Actualizando...' : 'Guardar y Notificar por Correo'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Tracking Steps */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Línea de Tiempo del Despacho (Tracking Audit)
            </h3>

            <div className="space-y-3 border-l-2 border-zinc-200 ml-3 pl-4">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className={`absolute -left-[23px] top-0.5 w-3 h-3 rounded-full border-2 ${
                    step.completed ? 'bg-zinc-900 border-zinc-1000' : 'bg-white border-zinc-300'
                  }`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className={`text-xs font-semibold ${step.completed ? 'text-zinc-800' : 'text-zinc-400'}`}>
                        {step.title}
                      </p>
                      {step.timestamp && (
                        <span className="text-[10px] text-zinc-400">
                          ({new Date(step.timestamp).toLocaleString('es-PE')})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">{step.description}</p>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">📍 {step.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Package Shipping Label Modal */}
          {/* Package Shipping Label Modal */}
      <PackageShippingLabelModal
        isOpen={isShippingLabelOpen}
        onClose={() => setIsShippingLabelOpen(false)}
        order={{
          id: order.id,
          trackingCode: order.trackingCode,
          customer: {
            name: order.customer.name,
            phone: order.customer.phone,
            email: order.customer.email,
            document: order.customer.document,
            docNumber: order.customer.documentNumber,
            address: order.customer.address,
            reference: order.customer.reference,
            province: order.customer.province,
            district: order.customer.district,
            zone: order.customer.zone,
            coords: order.customer.coords,
          },
          shippingAgency: order.customer.zone === 'Provincia (Agencia)' ? 'SHALOM EXPRESS' : 'MOTORIZADO EXPRESS LIMA',
          deliveryType: order.customer.zone === 'Provincia (Agencia)' ? 'provincia' : 'express',
          total: order.total,
          adelanto: order.adelanto,
          saldo: order.total - (order.adelanto || 0),
          items: order.items,
        }}
      />
      {/* Hidden Printable Receipt */}
      <div id="printable-receipt" className="hidden print:block absolute inset-0 bg-white text-slate-900 font-sans p-4">
        <div className="max-w-2xl mx-auto border border-[#61564A] bg-white text-slate-900 overflow-hidden font-sans shadow-sm mb-4">
          {/* Top Black Header */}
          <div className="bg-[#161716] text-[#E4DFD7] p-4 sm:p-5 flex justify-between items-center">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img src="/assets/Icono/icono-blanco.jpeg" alt="Obsidiana Logo" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border border-[#61564A]" />
              <div>
                <h1 className="font-serif font-medium text-2xl sm:text-4xl tracking-widest uppercase leading-none">
                  OBSIDIANA
                </h1>
                <p className="text-[8px] sm:text-[10px] font-medium text-[#A59B8F] uppercase tracking-[0.25em] mt-1.5 ml-0.5">
                  JOYERÍA EN PLATA 925/950
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end space-y-1">
              <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white mb-1">NOTA DE VENTA</p>
              <div className="bg-white text-[#161716] font-bold font-mono text-[10px] sm:text-xs px-3 py-1 w-32 sm:w-40 text-center">
                {order.orderNumber}
              </div>
              <p className="text-[9px] sm:text-[10px] font-bold text-[#A59B8F] mt-1">FECHA: {new Date(order.createdAt).toLocaleDateString('es-PE')}</p>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-5">
            {/* DATOS DEL CLIENTE Box Grid */}
            <div className="grid grid-cols-12 gap-4 text-xs">
              {/* Left Details (8 cols) */}
              <div className="col-span-12 sm:col-span-8 flex flex-col">
                <div className="bg-[#E4DFD7] px-3 py-1.5 font-bold text-[10px] text-[#161716] uppercase tracking-widest">
                  DATOS DEL CLIENTE
                </div>
                <div className="border border-t-0 border-[#E4DFD7] p-3 space-y-2.5 flex-1 bg-white">
                  <div className="flex items-center">
                    <User className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                    <span className="w-24 uppercase text-[9px] text-slate-600 font-bold tracking-wider">NOMBRE:</span>
                    <span className="font-semibold text-slate-900 border-b border-slate-200 flex-1 pb-0.5 px-1">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                    <span className="w-24 uppercase text-[9px] text-slate-600 font-bold tracking-wider">EMAIL:</span>
                    <span className="font-medium text-slate-900 border-b border-slate-200 flex-1 pb-0.5 px-1">{order.customer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                    <span className="w-24 uppercase text-[9px] text-slate-600 font-bold tracking-wider">TELÉFONO:</span>
                    <span className="font-medium text-slate-900 border-b border-slate-200 flex-1 pb-0.5 px-1">{order.customer.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                    <span className="w-24 uppercase text-[9px] text-slate-600 font-bold tracking-wider">DIRECCIÓN:</span>
                    <span className="font-medium text-slate-900 truncate border-b border-slate-200 flex-1 pb-0.5 px-1">{order.customer.address}</span>
                  </div>
                </div>
              </div>

              {/* Right Badge Card (4 cols) */}
              <div className="col-span-12 sm:col-span-4 flex flex-col">
                <div className="bg-[#E4DFD7] p-2.5 flex flex-col items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[10px] text-[#161716] uppercase tracking-wider">ZONA: {order.customer.zone || 'LIMA'}</span>
                  </div>
                </div>
                <div className="bg-[#F8F7F5] p-3 border border-t-0 border-[#E4DFD7] space-y-3 flex-1">
                  <div>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">COSTO ENVÍO</p>
                    <p className="font-medium text-slate-900 text-[11px] border-b border-[#E4DFD7] pb-1">S/ {order.shippingFee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">ADELANTO:</p>
                    <p className="font-medium text-slate-900 text-[11px] border-b border-[#E4DFD7] pb-1">S/ {(order.adelanto || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">SALDO:</p>
                    <p className="font-medium text-slate-900 text-[11px] border-b border-[#E4DFD7] pb-1">
                      {order.total - (order.adelanto || 0) > 0 ? `S/ ${(order.total - (order.adelanto || 0)).toFixed(2)} (Pendiente)` : 'CANCELADO'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-[10px] border-collapse border border-[#A59B8F]">
              <thead>
                <tr className="bg-[#A59B8F] text-[#161716] font-bold uppercase tracking-wider">
                  <th className="py-2 px-2 text-center border border-[#A59B8F] w-12">CANT.</th>
                  <th className="py-2 px-3 border border-[#A59B8F]">PRODUCTO</th>
                  <th className="py-2 px-2 text-center border border-[#A59B8F]">PRECIO UNIT.</th>
                  <th className="py-2 px-3 text-center border border-[#A59B8F]">TOTAL</th>
                </tr>
              </thead>
              <tbody className="bg-white text-slate-800">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-2 text-center font-medium border border-[#A59B8F]">{item.quantity}</td>
                    <td className="py-2 px-3 font-medium border border-[#A59B8F]">{item.productName}</td>
                    <td className="py-2 px-2 text-center font-medium border border-[#A59B8F]">S/ {item.unitPrice.toFixed(2)}</td>
                    <td className="py-2 px-3 text-center font-medium border border-[#A59B8F]">S/ {item.total.toFixed(2)}</td>
                  </tr>
                ))}
                {Array.from({ length: Math.max(0, 4 - order.items.length) }).map((_, i) => (
                  <tr key={`blank-${i}`} className="h-7">
                    <td className="border border-[#A59B8F]"></td>
                    <td className="border border-[#A59B8F]"></td>
                    <td className="border border-[#A59B8F]"></td>
                    <td className="border border-[#A59B8F]"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Section */}
            <div className="flex justify-end mt-4">
              <div className="w-full sm:w-1/2 flex flex-col items-end">
                <div className="flex justify-between w-full p-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Subtotal:</span>
                  <span className="text-xs font-semibold text-slate-900">S/ {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full p-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Envío:</span>
                  <span className="text-xs font-semibold text-slate-900">S/ {order.shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full p-3 bg-[#E4DFD7] text-[#161716] mt-2">
                  <span className="text-sm font-bold uppercase tracking-widest">Total General:</span>
                  <span className="text-sm font-black">
                    S/ {order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Guarantee Section */}
            <div className="mt-6 pt-5 border-t border-dashed border-[#A59B8F] text-center space-y-1">
              <p className="text-[10px] font-bold text-[#161716] uppercase tracking-widest">GARANTÍA DE AUTENTICIDAD DE POR VIDA</p>
              <p className="text-[9px] text-[#61564A]">Esta nota de venta certifica la autenticidad de sus joyas trabajadas en Plata Ley 925/950 por Obsidiana Joyería Perú.</p>
              <p className="text-[8px] text-[#A59B8F] mt-2 tracking-widest uppercase">GRACIAS POR ELEGIRNOS - @OBSIDIANA.JOYERIA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

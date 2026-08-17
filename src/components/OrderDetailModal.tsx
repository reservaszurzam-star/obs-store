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
  Tag,
  Edit2,
  Trash2,
  Ban,
  AlertTriangle
} from 'lucide-react';
import { Order, OrderStatus, Province, Zone } from '../types';
import { PackageShippingLabelModal } from './PackageShippingLabelModal';
import { EditOrderModal } from './EditOrderModal';
import { printElement } from '../lib/printHelper';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  onSendTestEmail: (recipientEmail: string, subject: string, bodyHtml: string) => Promise<void>;
  onDeleteOrder?: (orderId: string) => Promise<void>;
  onEditOrder?: (orderId: string, updatedData: Partial<Order>) => Promise<void>;
  onAnularOrder?: (orderId: string, reason?: string) => Promise<void>;
  provinces?: Province[];
  zones?: Zone[];
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onSendTestEmail,
  onDeleteOrder,
  onEditOrder,
  onAnularOrder,
  provinces = [],
  zones = [],
}) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('pendiente');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState('');
  const [isShippingLabelOpen, setIsShippingLabelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAnularConfirmOpen, setIsAnularConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [anularReason, setAnularReason] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  React.useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setStatusNote('');
      setEmailStatusMsg('');
    }
  }, [order]);

  if (!order) return null;

  const isCancelado = order.status === 'cancelado';

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
    printElement('order-detail-printable-receipt', `Nota de Venta #${order.orderNumber}`);
  };

  const handleConfirmAnular = async () => {
    if (!onAnularOrder) return;
    setIsProcessingAction(true);
    try {
      await onAnularOrder(order.id, anularReason);
      setIsAnularConfirmOpen(false);
      setAnularReason('');
      onClose();
    } catch (e: any) {
      setEmailStatusMsg(`Error al anular: ${e.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!onDeleteOrder) return;
    setIsProcessingAction(true);
    try {
      await onDeleteOrder(order.id);
      setIsDeleteConfirmOpen(false);
      onClose();
    } catch (e: any) {
      setEmailStatusMsg(`Error al eliminar: ${e.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 rounded-sm w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl text-zinc-800 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-sm bg-zinc-100 flex items-center justify-center font-bold text-zinc-900 border border-zinc-200">
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

          <div className="flex items-center flex-wrap gap-1.5">
            {/* Descargar Nota de Venta */}
            <button
              onClick={handlePrintReceipt}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-zinc-50 text-zinc-700 rounded-sm text-xs font-medium border border-zinc-200 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Descargar Nota de Venta</span>
            </button>

            {/* Editar Pedido */}
            {onEditOrder && (
              <button
                onClick={() => setIsEditing(true)}
                title="Editar datos del pedido"
                className="flex items-center space-x-1 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-sm text-xs font-semibold border border-zinc-300 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
            )}

            {/* Anular Pedido */}
            {onAnularOrder && (
              <button
                onClick={() => setIsAnularConfirmOpen(true)}
                disabled={isCancelado}
                title={isCancelado ? 'Pedido ya anulado' : 'Anular Pedido'}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-sm text-xs font-semibold border transition-colors cursor-pointer ${
                  isCancelado
                    ? 'bg-zinc-100 text-zinc-300 border-zinc-200 cursor-not-allowed'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Anular</span>
              </button>
            )}

            {/* Eliminar Pedido */}
            {onDeleteOrder && (
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                title="Eliminar Pedido definitivamente"
                className="flex items-center space-x-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-sm text-xs font-semibold border border-rose-200 hover:border-rose-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-sm hover:bg-zinc-100 transition-colors cursor-pointer"
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
      {/* Hidden Printable Receipt for Direct Print */}
      <div id="order-detail-printable-receipt" className="hidden print:block printable-content">
        <div className="w-full border border-[#61564A] bg-white text-slate-900 overflow-hidden font-sans shadow-sm">
          {/* Top Black Header */}
          <div className="bg-[#161716] text-[#E4DFD7] p-3.5 sm:p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <img src="/assets/Icono/icono-blanco.jpeg" alt="Obsidiana Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-[#61564A] shrink-0" />
              <div className="min-w-0">
                <h1 className="font-serif font-medium text-xl sm:text-2xl tracking-widest uppercase leading-none truncate">
                  OBSIDIANA
                </h1>
                <p className="text-[8px] sm:text-[9px] font-medium text-[#A59B8F] uppercase tracking-[0.25em] mt-1">
                  JOYERÍA EN PLATA 925/950
                </p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end space-y-1 shrink-0 ml-4">
              <p className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-white mb-0.5">NOTA DE VENTA</p>
              <div className="bg-white text-[#161716] font-bold font-mono text-[10px] sm:text-xs px-2.5 py-1 text-center whitespace-nowrap">
                {order.orderNumber}
              </div>
              <p className="text-[8px] sm:text-[9px] font-bold text-[#A59B8F] mt-0.5">FECHA: {new Date(order.createdAt).toLocaleDateString('es-PE')}</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 space-y-3">
            {/* DATOS DEL CLIENTE Box Grid */}
            <div className="grid grid-cols-12 gap-3 text-xs">
              {/* Left Details (8 cols) */}
              <div className="col-span-8 flex flex-col">
                <div className="bg-[#E4DFD7] px-3 py-1 font-bold text-[9px] text-[#161716] uppercase tracking-widest">
                  DATOS DEL CLIENTE
                </div>
                <div className="border border-t-0 border-[#E4DFD7] p-2.5 space-y-2 flex-1 bg-white text-[10px]">
                  <div className="flex items-center">
                    <span className="w-20 uppercase text-[8px] text-slate-500 font-bold tracking-wider">NOMBRE:</span>
                    <span className="font-semibold text-slate-900 border-b border-slate-200 flex-1 pb-0.5 px-1 truncate">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 uppercase text-[8px] text-slate-500 font-bold tracking-wider">EMAIL:</span>
                    <span className="font-medium text-slate-900 border-b border-slate-200 flex-1 pb-0.5 px-1 truncate">{order.customer.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 uppercase text-[8px] text-slate-500 font-bold tracking-wider">TELÉFONO:</span>
                    <span className="font-medium text-slate-900 border-b border-slate-200 flex-1 pb-0.5 px-1">{order.customer.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 uppercase text-[8px] text-slate-500 font-bold tracking-wider">DIRECCIÓN:</span>
                    <span className="font-medium text-slate-900 truncate border-b border-slate-200 flex-1 pb-0.5 px-1">{order.customer.address || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Right Badge Card (4 cols) */}
              <div className="col-span-4 flex flex-col">
                <div className="bg-[#E4DFD7] p-2 flex flex-col items-center justify-center">
                  <span className="font-bold text-[9px] text-[#161716] uppercase tracking-wider truncate">ENVÍO: {order.customer.zone || 'LIMA'}</span>
                </div>
                <div className="bg-[#F8F7F5] p-2.5 border border-t-0 border-[#E4DFD7] space-y-2 flex-1 text-[10px]">
                  <div>
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">COSTO ENVÍO</p>
                    <p className="font-medium text-slate-900 border-b border-[#E4DFD7] pb-0.5">S/ {order.shippingFee.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">ADELANTO:</p>
                    <p className="font-medium text-slate-900 border-b border-[#E4DFD7] pb-0.5">S/ {(order.adelanto || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">SALDO:</p>
                    <p className="font-medium text-slate-900 border-b border-[#E4DFD7] pb-0.5">
                      {order.total - (order.adelanto || 0) > 0 ? `S/ ${(order.total - (order.adelanto || 0)).toFixed(2)} (Pendiente)` : 'CANCELADO'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-[9px] border-collapse border border-[#A59B8F]">
              <thead>
                <tr className="bg-[#A59B8F] text-[#161716] font-bold uppercase tracking-wider">
                  <th className="py-1.5 px-2 text-center border border-[#A59B8F] w-12">CANT.</th>
                  <th className="py-1.5 px-3 border border-[#A59B8F]">PRODUCTO</th>
                  <th className="py-1.5 px-2 text-center border border-[#A59B8F]">PRECIO UNIT.</th>
                  <th className="py-1.5 px-3 text-center border border-[#A59B8F]">TOTAL</th>
                </tr>
              </thead>
              <tbody className="bg-white text-slate-800">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-1.5 px-2 text-center font-medium border border-[#A59B8F]">{item.quantity}</td>
                    <td className="py-1.5 px-3 font-medium border border-[#A59B8F]">{item.productName}</td>
                    <td className="py-1.5 px-2 text-center font-medium border border-[#A59B8F]">S/ {item.unitPrice.toFixed(2)}</td>
                    <td className="py-1.5 px-3 text-center font-medium border border-[#A59B8F]">S/ {item.total.toFixed(2)}</td>
                  </tr>
                ))}
                {Array.from({ length: Math.max(0, 2 - order.items.length) }).map((_, i) => (
                  <tr key={`blank-${i}`} className="h-5">
                    <td className="border border-[#A59B8F]"></td>
                    <td className="border border-[#A59B8F]"></td>
                    <td className="border border-[#A59B8F]"></td>
                    <td className="border border-[#A59B8F]"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Section */}
            <div className="flex justify-end">
              <div className="w-64 flex flex-col items-end">
                <div className="flex justify-between w-full py-1 border-b border-slate-200 text-[10px]">
                  <span className="font-bold text-slate-600 uppercase tracking-wider">Subtotal:</span>
                  <span className="font-semibold text-slate-900">S/ {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full py-1 border-b border-slate-200 text-[10px]">
                  <span className="font-bold text-slate-600 uppercase tracking-wider">Envío:</span>
                  <span className="font-semibold text-slate-900">S/ {order.shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full p-2 bg-[#E4DFD7] text-[#161716] mt-1">
                  <span className="text-xs font-bold uppercase tracking-widest">Total General:</span>
                  <span className="text-sm font-black">
                    S/ {order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Guarantee Section */}
            <div className="mt-3 pt-3 border-t border-dashed border-[#A59B8F] text-center space-y-1">
              <p className="text-[9px] font-bold text-[#161716] uppercase tracking-widest">GARANTÍA DE AUTENTICIDAD DE POR VIDA</p>
              <p className="text-[8px] text-[#61564A]">Esta nota de venta certifica la autenticidad de sus joyas trabajadas en Plata Ley 925/950 por Obsidiana Joyería Perú.</p>
              <p className="text-[7px] text-[#A59B8F] mt-1 tracking-widest uppercase">GRACIAS POR ELEGIRNOS - @OBSIDIANA.JOYERIA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Order Modal */}
      {isEditing && onEditOrder && (
        <EditOrderModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          order={order}
          provinces={provinces}
          zones={zones}
          onSave={async (orderId, data) => {
            await onEditOrder(orderId, data);
            setIsEditing(false);
          }}
        />
      )}

      {/* Modal Confirmación Anular */}
      {isAnularConfirmOpen && onAnularOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-amber-200 rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">¿Anular Pedido {order.orderNumber}?</h3>
                <p className="text-xs text-zinc-500">El estado del pedido cambiará a "Cancelado".</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Motivo de Anulación (opcional)</label>
              <textarea
                rows={2}
                value={anularReason}
                onChange={(e) => setAnularReason(e.target.value)}
                placeholder="Ej. Cliente desistió de la compra / Error en duplicado..."
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAnularConfirmOpen(false);
                  setAnularReason('');
                }}
                disabled={isProcessingAction}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmAnular}
                disabled={isProcessingAction}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1 shadow-sm disabled:opacity-50"
              >
                <Ban className="w-4 h-4" />
                <span>{isProcessingAction ? 'Anulando...' : 'Confirmar Anulación'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminar */}
      {isDeleteConfirmOpen && onDeleteOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">¿Eliminar Pedido Definitivamente?</h3>
                <p className="text-xs text-zinc-500 font-mono font-bold text-rose-600">{order.orderNumber} - {order.customer.name}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 bg-rose-50 p-3 rounded-lg border border-rose-100">
              ⚠️ Esta acción <strong>eliminará permanentemente</strong> el registro del pedido, sus ítems y movimientos vinculados. Esta operación no se puede deshacer.
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isProcessingAction}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isProcessingAction}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1 shadow-sm disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isProcessingAction ? 'Eliminando...' : 'Sí, Eliminar'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

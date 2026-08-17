import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PackageCheck, 
  MapPin, 
  ChevronRight,
  ExternalLink,
  Printer,
  Tag,
  Zap,
  Edit2,
  Trash2,
  Ban,
  AlertTriangle,
  X,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus, Province, Zone } from '../types';
import { PackageShippingLabelModal } from './PackageShippingLabelModal';
import { EditOrderModal } from './EditOrderModal';

interface OrdersListProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onTrackOrder: (trackingCode: string) => void;
  onOpenNewOrder: () => void;
  onAutoProcess?: () => void;
  onDeleteOrder?: (orderId: string) => Promise<void>;
  onEditOrder?: (orderId: string, updatedData: Partial<Order>) => Promise<void>;
  onAnularOrder?: (orderId: string, reason?: string) => Promise<void>;
  provinces?: Province[];
  zones?: Zone[];
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  onSelectOrder,
  onUpdateOrderStatus,
  onTrackOrder,
  onOpenNewOrder,
  onAutoProcess,
  onDeleteOrder,
  onEditOrder,
  onAnularOrder,
  provinces = [],
  zones = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [selectedLabelOrder, setSelectedLabelOrder] = useState<Order | null>(null);

  // Action Modals State
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [orderToAnular, setOrderToAnular] = useState<Order | null>(null);
  const [anularReason, setAnularReason] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.province.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchProvince = provinceFilter === 'all' || o.customer.province.toLowerCase().includes(provinceFilter.toLowerCase());

      return matchSearch && matchStatus && matchProvince;
    });
  }, [orders, searchQuery, statusFilter, provinceFilter]);

  // Status Badge Helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pendiente':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Pendiente</span>
          </span>
        );
      case 'en_preparacion':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>En Preparación</span>
          </span>
        );
      case 'en_ruta':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <Truck className="w-3.5 h-3.5" />
            <span>En Ruta</span>
          </span>
        );
      case 'entregado':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Entregado</span>
          </span>
        );
      case 'cancelado':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelado</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete || !onDeleteOrder) return;
    setIsProcessingAction(true);
    try {
      await onDeleteOrder(orderToDelete.id);
      setOrderToDelete(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleConfirmAnular = async () => {
    if (!orderToAnular || !onAnularOrder) return;
    setIsProcessingAction(true);
    try {
      await onAnularOrder(orderToAnular.id, anularReason);
      setOrderToAnular(null);
      setAnularReason('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Gestión de Pedidos & Despachos</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Registro, actualización de estados, envío de comprobantes y trazabilidad en tiempo real.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onAutoProcess && (
            <button
              onClick={onAutoProcess}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-sm text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Auto Procesar</span>
            </button>
          )}

          <button
            onClick={onOpenNewOrder}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#61564A] hover:bg-[#61564A]/90 text-white rounded-sm text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>+ Nuevo Pedido (POS)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-sm border border-zinc-200 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por N° Pedido, cliente, correo o tracking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-zinc-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 text-zinc-900"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-zinc-200 rounded-sm px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer"
          >
            <option value="all">Todos los Estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_preparacion">En Preparación</option>
            <option value="en_ruta">En Ruta</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="text-xs border border-zinc-200 rounded-sm px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer"
          >
            <option value="all">Todas las Provincias</option>
            <option value="lima">Lima / Callao</option>
            <option value="arequipa">Arequipa</option>
            <option value="cusco">Cusco</option>
            <option value="trujillo">Trujillo</option>
            <option value="chiclayo">Chiclayo</option>
            <option value="piura">Piura</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-zinc-200 rounded-sm shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#181716] text-[#E4DFD7] text-[11px] uppercase tracking-wider font-semibold border-b border-[#61564A]/30">
                <th className="py-3 px-4">Pedido / Tracking</th>
                <th className="py-3 px-4">Cliente & Email</th>
                <th className="py-3 px-4">Ubicación & Zona</th>
                <th className="py-3 px-4">Total (S/)</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200 text-xs text-zinc-900">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 font-medium">
                    No se encontraron pedidos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isCancelado = order.status === 'cancelado';
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-zinc-50/80 transition-colors group"
                    >
                      {/* Order & Tracking */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-900">{order.orderNumber}</div>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <span className="font-mono text-[11px] text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 font-bold">
                            {order.trackingCode}
                          </span>
                          <button
                            onClick={() => onTrackOrder(order.trackingCode)}
                            title="Ver en Portal Tracking"
                            className="text-zinc-400 hover:text-zinc-800 p-0.5 cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-900">{order.customer.name}</div>
                        <div className="text-zinc-500 text-[11px]">{order.customer.email || 'Sin correo'}</div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1 text-zinc-800">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate max-w-[150px]">
                            {order.customer.district || 'Lima'}, {order.customer.province || 'Lima'}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500">{order.customer.zone || 'Lima Express'}</div>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-900">S/ {order.total.toFixed(2)}</div>
                        <div className="text-[10px] text-zinc-500">
                          {order.items.reduce((sum, i) => sum + i.quantity, 0)} ítems
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-zinc-600 text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center flex-wrap gap-1">
                          {/* Rotulado */}
                          <button
                            onClick={() => setSelectedLabelOrder(order)}
                            title="Imprimir Rótulo de Envío (Shalom / Olva / Courier)"
                            className="px-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded text-xs font-black transition-all flex items-center space-x-1 shadow-xs cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Rotulado</span>
                          </button>

                          {/* Ver Detalle */}
                          <button
                            onClick={() => onSelectOrder(order)}
                            title="Ver Detalle del Pedido"
                            className="px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-semibold transition-colors flex items-center space-x-1 shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detalle</span>
                          </button>

                          {/* Editar Pedido */}
                          {onEditOrder && (
                            <button
                              onClick={() => setEditingOrder(order)}
                              title="Editar datos del pedido y cliente"
                              className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 rounded border border-zinc-300 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Anular Pedido */}
                          {onAnularOrder && (
                            <button
                              onClick={() => setOrderToAnular(order)}
                              disabled={isCancelado}
                              title={isCancelado ? 'Este pedido ya está cancelado' : 'Anular / Cancelar Pedido'}
                              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                                isCancelado
                                  ? 'bg-zinc-100 text-zinc-300 border-zinc-200 cursor-not-allowed'
                                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300'
                              }`}
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Eliminar Pedido */}
                          {onDeleteOrder && (
                            <button
                              onClick={() => setOrderToDelete(order)}
                              title="Eliminar Pedido permanentemente"
                              className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded border border-rose-200 hover:border-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Package Shipping Label Modal */}
      {selectedLabelOrder && (
        <PackageShippingLabelModal
          isOpen={Boolean(selectedLabelOrder)}
          onClose={() => setSelectedLabelOrder(null)}
          order={{
            id: selectedLabelOrder.id,
            orderNumber: selectedLabelOrder.orderNumber,
            trackingCode: selectedLabelOrder.trackingCode,
            customer: {
              name: selectedLabelOrder.customer.name,
              phone: selectedLabelOrder.customer.phone,
              email: selectedLabelOrder.customer.email,
              document: selectedLabelOrder.customer.document,
              docNumber: selectedLabelOrder.customer.documentNumber,
              address: selectedLabelOrder.customer.address,
              reference: selectedLabelOrder.customer.notes,
              province: selectedLabelOrder.customer.province,
              district: selectedLabelOrder.customer.district,
              zone: selectedLabelOrder.customer.zone,
              coords: selectedLabelOrder.customer.coords,
            },
            shippingAgency: selectedLabelOrder.customer.zone === 'Provincia (Agencia)' ? 'SHALOM EXPRESS' : 'MOTORIZADO EXPRESS LIMA',
            deliveryType: selectedLabelOrder.customer.zone === 'Provincia (Agencia)' ? 'provincia' : 'express',
            total: selectedLabelOrder.total,
            adelanto: selectedLabelOrder.adelanto,
            saldo: selectedLabelOrder.total - (selectedLabelOrder.adelanto || 0),
            items: selectedLabelOrder.items,
          }}
        />
      )}

      {/* Edit Order Modal */}
      {editingOrder && onEditOrder && (
        <EditOrderModal
          isOpen={Boolean(editingOrder)}
          onClose={() => setEditingOrder(null)}
          order={editingOrder}
          provinces={provinces}
          zones={zones}
          onSave={onEditOrder}
        />
      )}

      {/* Modal Confirmación Anular */}
      {orderToAnular && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-amber-200 rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Ban className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">¿Anular Pedido {orderToAnular.orderNumber}?</h3>
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
                  setOrderToAnular(null);
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
      {orderToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">¿Eliminar Pedido Definitivamente?</h3>
                <p className="text-xs text-zinc-500 font-mono font-bold text-rose-600">{orderToDelete.orderNumber} - {orderToDelete.customer.name}</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 bg-rose-50 p-3 rounded-lg border border-rose-100">
              ⚠️ Esta acción <strong>eliminará permanentemente</strong> el registro del pedido, sus ítems y movimientos vinculados. Esta operación no se puede deshacer.
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
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

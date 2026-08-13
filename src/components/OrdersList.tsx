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
  Zap
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { PackageShippingLabelModal } from './PackageShippingLabelModal';

interface OrdersListProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onTrackOrder: (trackingCode: string) => void;
  onOpenNewOrder: () => void;
  onAutoProcess?: () => void;
}

export const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  onSelectOrder,
  onUpdateOrderStatus,
  onTrackOrder,
  onOpenNewOrder,
  onAutoProcess,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [selectedLabelOrder, setSelectedLabelOrder] = useState<Order | null>(null);


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
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>En Preparación</span>
          </span>
        );
      case 'en_ruta':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
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

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#A59B8F]/30 p-5 rounded-xl shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-[#181716] flex items-center space-x-2">
            <span>Gestión de Pedidos & Despachos</span>
            <span className="bg-[#61564A]/10 text-[#61564A] text-xs px-2.5 py-0.5 rounded-full border border-[#61564A]/20 font-semibold">
              {orders.length} Totales
            </span>
          </h1>
          <p className="text-xs text-[#61564A] mt-1">
            Registro, actualización de estados, envío de comprobantes y trazabilidad en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {onAutoProcess && (
            <button
              onClick={onAutoProcess}
              title="Ejecuta el flujo logístico automático: avanza los pedidos de estado según el tiempo transcurrido (preparación, ruta, entrega) y dispara notificaciones."
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 border border-amber-300 text-xs font-black px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center space-x-2 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Procesamiento Automático</span>
            </button>
          )}

          <button
            onClick={onOpenNewOrder}
            className="bg-[#61564A] hover:bg-[#61564A]/90 text-[#E4DFD7] border border-[#A59B8F]/40 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center space-x-2 active:scale-95"
          >
            <span>+ Crear Nuevo Pedido</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 border border-[#A59B8F]/30 rounded-xl shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#A59B8F] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por N° Pedido, cliente, correo o TRK..."
            className="w-full bg-[#E4DFD7]/30 border border-[#A59B8F]/40 rounded-lg pl-9 pr-3 py-2 text-xs text-[#181716] placeholder-[#A59B8F] focus:outline-none focus:border-[#61564A]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[#A59B8F] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#E4DFD7]/30 border border-[#A59B8F]/40 rounded-lg px-3 py-2 text-xs text-[#181716] focus:outline-none focus:border-[#61564A]"
          >
            <option value="all">Todos los Estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_preparacion">En Preparación</option>
            <option value="en_ruta">En Ruta de Entrega</option>
            <option value="entregado">Entregados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>

        {/* Province Filter */}
        <div>
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="w-full bg-[#E4DFD7]/30 border border-[#A59B8F]/40 rounded-lg px-3 py-2 text-xs text-[#181716] focus:outline-none focus:border-[#61564A]"
          >
            <option value="all">Todas las Provincias</option>
            <option value="lima">Lima</option>
            <option value="arequipa">Arequipa</option>
            <option value="trujillo">La Libertad (Trujillo)</option>
            <option value="cusco">Cusco</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#A59B8F]/30 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#181716] border-b border-[#61564A] text-[10px] font-bold text-[#A59B8F] uppercase tracking-wider">
                <th className="py-3 px-4">Pedido / Tracking</th>
                <th className="py-3 px-4">Cliente & Email</th>
                <th className="py-3 px-4">Ubicación & Zona</th>
                <th className="py-3 px-4">Total (S/)</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#A59B8F]/20 text-xs text-[#181716]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#61564A]">
                    No se encontraron pedidos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#E4DFD7]/40 transition-colors group"
                  >
                    {/* Order & Tracking */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#181716]">{order.orderNumber}</div>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <span className="font-mono text-[11px] text-[#181716] bg-[#E4DFD7] px-1.5 py-0.5 rounded border border-[#A59B8F]/40 font-bold">
                          {order.trackingCode}
                        </span>
                        <button
                          onClick={() => onTrackOrder(order.trackingCode)}
                          title="Ver en Portal Tracking"
                          className="text-[#61564A] hover:text-[#181716] p-0.5"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#181716]">{order.customer.name}</div>
                      <div className="text-[#61564A] text-[11px]">{order.customer.email}</div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 text-[#181716]">
                        <MapPin className="w-3.5 h-3.5 text-[#61564A] shrink-0" />
                        <span className="truncate max-w-[150px]">
                          {order.customer.district}, {order.customer.province}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#61564A]">{order.customer.zone}</div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#181716]">S/ {order.total.toFixed(2)}</div>
                      <div className="text-[10px] text-[#61564A]">
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)} ítems
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.status)}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#61564A] text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setSelectedLabelOrder(order)}
                          title="Imprimir Rotulado de Paquete (Shalom/Olva/Motorizado)"
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-black transition-all flex items-center space-x-1 shadow-xs cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Rotulado</span>
                        </button>
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="px-3 py-1.5 bg-[#61564A] hover:bg-[#61564A]/90 text-[#E4DFD7] rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1 border border-[#A59B8F]/30 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Detalle</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
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
            trackingCode: selectedLabelOrder.trackingCode,
            customer: {
              name: selectedLabelOrder.customer.name,
              phone: selectedLabelOrder.customer.phone,
              email: selectedLabelOrder.customer.email,
              document: selectedLabelOrder.customer.document,
              docNumber: selectedLabelOrder.customer.documentNumber,
              address: selectedLabelOrder.customer.address,
              reference: selectedLabelOrder.customer.reference,
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

    </div>
  );
};

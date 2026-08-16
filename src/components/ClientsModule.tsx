import React, { useMemo, useState } from 'react';
import { Users, Search, MapPin, ShoppingBag, DollarSign } from 'lucide-react';
import { ClientDetailModal } from './ClientDetailModal';
import { Order, Customer } from '../types';

interface ClientsModuleProps {
  orders: Order[];
}

export const ClientsModule: React.FC<ClientsModuleProps> = ({ orders }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const clients = useMemo(() => {
    const clientMap = new Map<string, { id: string; customer: Customer; orderCount: number; totalSpent: number; lastOrderDate: string; orders: Order[] }>();

    orders.forEach((order) => {
      // Use email or document as unique identifier, fallback to name
      const id = order.customer.email || order.customer.documentNumber || order.customer.name;
      
      const existing = clientMap.get(id);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.total;
        if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.createdAt;
        }
        existing.orders.push(order);
      } else {
        clientMap.set(id, {
          id,
          customer: order.customer,
          orderCount: 1,
          totalSpent: order.total,
          lastOrderDate: order.createdAt,
          orders: [order]
        });
      }
    });

    return Array.from(clientMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filteredClients = clients.filter(c => 
    c.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.customer.documentNumber?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-zinc-100 p-5 shadow-sm font-sans">
        <div>
          <h1 className="text-lg font-light tracking-wide text-zinc-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-zinc-400" />
            <span className="uppercase tracking-widest">Directorio de Clientes</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1 font-light">
            Visualiza a todos tus clientes y su historial de compras acumulado.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, DNI o correo..."
            className="w-full bg-zinc-50 border border-zinc-200 pl-9 pr-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors"
          />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 shadow-sm text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Total Clientes</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <span className="text-3xl font-light mt-2 block">{clients.length}</span>
        </div>
        <div className="bg-white border border-zinc-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Compras Totales</span>
            <ShoppingBag className="w-4 h-4 text-zinc-400" />
          </div>
          <span className="text-3xl font-light mt-2 block">{orders.length}</span>
        </div>
        <div className="bg-white border border-zinc-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">LTV Promedio</span>
            <DollarSign className="w-4 h-4 text-zinc-400" />
          </div>
          <span className="text-3xl font-light mt-2 block">
            S/ {clients.length ? (clients.reduce((sum, c) => sum + c.totalSpent, 0) / clients.length).toFixed(2) : '0.00'}
          </span>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-4 px-6">Cliente</th>
                <th className="py-4 px-6">Ubicación</th>
                <th className="py-4 px-6 text-center">N° Compras</th>
                <th className="py-4 px-6 text-right">Total Gastado</th>
                <th className="py-4 px-6 text-right">Última Compra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 text-sm text-zinc-600 font-light">
              {filteredClients.map((c) => (
                <React.Fragment key={c.id}>
                  <tr 
                    onClick={() => setSelectedClient(c)}
                    className="hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-zinc-900 flex items-center gap-2">
                        {c.customer.name}
                      </div>
                      <div className="text-xs text-zinc-400 mt-1 ml-0">
                        {c.customer.email || c.customer.phone || c.customer.documentNumber || 'Sin datos de contacto'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-300" />
                        <span>{c.customer.district}, {c.customer.province}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center justify-center bg-zinc-100 text-zinc-600 font-medium w-6 h-6 text-xs">
                        {c.orderCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-zinc-900">
                      S/ {c.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right text-xs text-zinc-400">
                      {new Date(c.lastOrderDate).toLocaleDateString('es-PE')}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400">
                    No se encontraron clientes con esos criterios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedClient && (
        <ClientDetailModal 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
        />
      )}

    </div>
  );
};

import React from 'react';
import { X, MapPin, Package, Calendar, Phone, Mail, FileText, ShoppingBag } from 'lucide-react';
import { Order, Customer } from '../types';

interface ClientDetailModalProps {
  client: {
    id: string;
    customer: Customer;
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string;
    orders: Order[];
  };
  onClose: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm font-sans">
      <div className="bg-white w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-zinc-900 text-white p-6 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-light tracking-wide flex items-center gap-3">
              <span className="uppercase">{client.customer.name}</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-medium tracking-widest uppercase">
              Cliente Registrado
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-zinc-800 rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50">
          
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Contact Info */}
            <div className="bg-white border border-zinc-200 p-5 shadow-sm rounded-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" /> Datos del Cliente
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <span>{client.customer.email || 'Sin correo'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <span>{client.customer.phone || 'Sin teléfono'}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-zinc-600">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-zinc-800">{client.customer.district}, {client.customer.province}</div>
                    <div className="text-xs mt-0.5">{client.customer.address}</div>
                    {client.customer.reference && (
                      <div className="text-xs text-zinc-400 mt-0.5 italic">Ref: {client.customer.reference}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary KPI */}
            <div className="bg-white border border-zinc-200 p-5 shadow-sm rounded-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Resumen de Compras
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-sm">
                  <div className="text-[10px] text-zinc-400 uppercase font-semibold">Total Gastado</div>
                  <div className="text-lg font-medium text-zinc-900 mt-1">S/ {client.totalSpent.toFixed(2)}</div>
                </div>
                <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-sm">
                  <div className="text-[10px] text-zinc-400 uppercase font-semibold">N° Compras</div>
                  <div className="text-lg font-medium text-zinc-900 mt-1">{client.orderCount}</div>
                </div>
                <div className="col-span-2 bg-zinc-50 border border-zinc-100 p-3 rounded-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase font-semibold">Última Compra</div>
                    <div className="text-sm font-medium text-zinc-900 mt-0.5">
                      {new Date(client.lastOrderDate).toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Order History */}
          <div className="bg-white border border-zinc-200 shadow-sm rounded-sm">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50">
               <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                 <Package className="w-4 h-4" /> Historial de Pedidos
               </h3>
            </div>
            
            <div className="divide-y divide-zinc-100">
              {client.orders.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                <div key={order.id} className="p-4 hover:bg-zinc-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-zinc-100 p-2 rounded-sm">
                      <ShoppingBag className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 text-sm">{order.orderNumber}</div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {new Date(order.createdAt).toLocaleString('es-PE', { hour12: true })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6 flex-1">
                    <div className="text-left sm:text-right">
                      <div className="text-xs text-zinc-400">Estado</div>
                      <span className={`inline-block mt-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${
                        order.status === 'entregado' ? 'bg-green-100 text-green-800 border border-green-200' :
                        order.status === 'cancelado' ? 'bg-red-100 text-red-800 border border-red-200' :
                        'bg-zinc-200 text-zinc-800 border border-zinc-300'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <div className="text-xs text-zinc-400">{order.items.length} item(s)</div>
                      <div className="font-semibold text-zinc-900 text-sm mt-1">S/ {order.total.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  ShoppingBag, 
  Package, 
  MapPin, 
  Search, 
  BarChart3, 
  Mail, 
  Plus, 
  RotateCcw,
  Truck,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'orders' | 'inventory' | 'shipping' | 'tracking' | 'reports' | 'emails';
  setActiveTab: (tab: 'orders' | 'inventory' | 'shipping' | 'tracking' | 'reports' | 'emails') => void;
  onOpenNewOrder: () => void;
  onResetData: () => void;
  pendingOrdersCount: number;
  lowStockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewOrder,
  onResetData,
  pendingOrdersCount,
  lowStockCount,
}) => {
  return (
    <header className="bg-white text-slate-800 border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('orders')}>
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 block leading-none uppercase">
                Logistics<span className="text-blue-600 font-bold">OS</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Gestión de Pedidos, Inventario & Envíos
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              id="nav-btn-orders"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-slate-100 text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Pedidos</span>
              {pendingOrdersCount > 0 && (
                <span className="bg-amber-100 text-amber-700 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              id="nav-btn-inventory"
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'inventory'
                  ? 'bg-slate-100 text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Inventario</span>
              {lowStockCount > 0 && (
                <span className="bg-red-100 text-red-600 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                  {lowStockCount}
                </span>
              )}
            </button>

            <button
              id="nav-btn-shipping"
              onClick={() => setActiveTab('shipping')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'shipping'
                  ? 'bg-slate-100 text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Envíos & Zonas</span>
            </button>

            <button
              id="nav-btn-tracking"
              onClick={() => setActiveTab('tracking')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'tracking'
                  ? 'bg-slate-100 text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Tracking</span>
            </button>

            <button
              id="nav-btn-reports"
              onClick={() => setActiveTab('reports')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'reports'
                  ? 'bg-slate-100 text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reportes</span>
            </button>

            <button
              id="nav-btn-emails"
              onClick={() => setActiveTab('emails')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'emails'
                  ? 'bg-slate-100 text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Correo & Logs</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-reset-demo-data"
              onClick={onResetData}
              title="Restablecer datos de prueba"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="btn-open-register-order"
              onClick={onOpenNewOrder}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Pedido</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-Bar */}
        <div className="flex md:hidden overflow-x-auto space-x-2 py-2 border-t border-slate-100 text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-slate-100 text-blue-600 font-semibold' : 'text-slate-500'
            }`}
          >
            Pedidos ({pendingOrdersCount})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'inventory' ? 'bg-slate-100 text-blue-600 font-semibold' : 'text-slate-500'
            }`}
          >
            Inventario
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'shipping' ? 'bg-slate-100 text-blue-600 font-semibold' : 'text-slate-500'
            }`}
          >
            Zonas & Tarifas
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'tracking' ? 'bg-slate-100 text-blue-600 font-semibold' : 'text-slate-500'
            }`}
          >
            Tracking
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'reports' ? 'bg-slate-100 text-blue-600 font-semibold' : 'text-slate-500'
            }`}
          >
            Reportes
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap ${
              activeTab === 'emails' ? 'bg-slate-100 text-blue-600 font-semibold' : 'text-slate-500'
            }`}
          >
            Correos
          </button>
        </div>

      </div>
    </header>
  );
};

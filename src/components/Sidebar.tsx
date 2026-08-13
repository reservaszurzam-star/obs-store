import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Package, 
  MapPin, 
  Search, 
  BarChart3, 
  Mail, 
  Plus, 
  RotateCcw,
  Menu,
  X,
  Gem,
  Store
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'orders' | 'pos' | 'inventory' | 'shipping' | 'tracking' | 'reports' | 'emails';
  setActiveTab: (tab: 'orders' | 'pos' | 'inventory' | 'shipping' | 'tracking' | 'reports' | 'emails') => void;
  onOpenNewOrder: () => void;
  onResetData: () => void;
  pendingOrdersCount: number;
  lowStockCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewOrder,
  onResetData,
  pendingOrdersCount,
  lowStockCount,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      id: 'pos' as const,
      label: 'Punto de Venta / Nota',
      icon: Store,
      badge: 'POS',
      badgeColor: 'bg-[#A59B8F] text-[#181716] font-black',
    },
    {
      id: 'orders' as const,
      label: 'Pedidos',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
      badgeColor: 'bg-[#61564A] text-[#E4DFD7]',
    },
    {
      id: 'inventory' as const,
      label: 'Inventario (47)',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: 'bg-red-900/80 text-red-200 border border-red-700/50',
    },
    {
      id: 'shipping' as const,
      label: 'Envíos & Zonas',
      icon: MapPin,
    },
    {
      id: 'tracking' as const,
      label: 'Tracking',
      icon: Search,
    },
    {
      id: 'reports' as const,
      label: 'Reportes',
      icon: BarChart3,
    },
    {
      id: 'emails' as const,
      label: 'Correo & Logs',
      icon: Mail,
    },
  ];

  const handleNavClick = (id: 'orders' | 'pos' | 'inventory' | 'shipping' | 'tracking' | 'reports' | 'emails') => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#181716] border-b border-[#61564A]/40 px-4 py-3 flex items-center justify-between text-[#E4DFD7] sticky top-0 z-30">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('orders')}>
          <div className="w-8 h-8 rounded-lg bg-[#61564A] flex items-center justify-center text-[#E4DFD7] border border-[#A59B8F]/30">
            <Gem className="w-4 h-4 text-[#E4DFD7]" />
          </div>
          <span className="font-extrabold text-sm tracking-wider text-[#E4DFD7] uppercase">
            OBSIDIANA
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#A59B8F] hover:text-[#E4DFD7] hover:bg-[#61564A]/30 rounded-lg transition-colors border border-[#A59B8F]/30"
          aria-label="Abrir Menú Lateral"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Side Navigation Bar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40
          w-64 md:w-72 h-screen
          bg-[#181716] border-r border-[#61564A]/50
          text-[#E4DFD7] flex flex-col justify-between
          transition-transform duration-300 ease-in-out shrink-0
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Top Header Section */}
        <div className="p-5 border-b border-[#61564A]/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('orders')}>
              <div className="w-10 h-10 rounded-xl bg-[#61564A] text-[#E4DFD7] flex items-center justify-center shadow-inner border border-[#A59B8F]/30">
                <Gem className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-black text-base tracking-widest text-[#E4DFD7] leading-none uppercase">
                  OBSIDIANA
                </h1>
                <p className="text-[11px] text-[#A59B8F] mt-1 font-medium">
                  Joyería & Plata 925 / 950
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-[#A59B8F] hover:text-[#E4DFD7] p-1.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Action Button */}
          <button
            id="btn-sidebar-new-order"
            onClick={() => {
              onOpenNewOrder();
              setMobileOpen(false);
            }}
            className="w-full bg-[#61564A] hover:bg-[#61564A]/80 text-[#E4DFD7] border border-[#A59B8F]/40 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ REGISTRAR PEDIDO</span>
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-[#A59B8F] uppercase tracking-wider">
            Navegación Principal
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold
                  transition-all duration-200 group cursor-pointer
                  ${
                    isActive
                      ? 'bg-[#61564A] text-[#E4DFD7] shadow-sm border border-[#A59B8F]/40 font-bold'
                      : 'text-[#A59B8F] hover:text-[#E4DFD7] hover:bg-[#61564A]/30 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-[#E4DFD7]' : 'text-[#A59B8F]'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${item.badgeColor || 'bg-[#A59B8F] text-[#181716]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Controls */}
        <div className="p-4 border-t border-[#61564A]/40 bg-[#181716] space-y-3">
          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            className="w-full flex items-center justify-center space-x-2 text-xs font-semibold text-[#A59B8F] hover:text-[#E4DFD7] bg-[#181716] hover:bg-[#61564A]/40 border border-[#61564A]/60 py-2.5 px-3 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Datos</span>
          </button>

          <p className="text-[10px] text-center text-[#A59B8F]/80">
            Obsidiana Perú © 2026
          </p>
        </div>
      </aside>

      {/* Backdrop overlay for mobile menu */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}
    </>
  );
};

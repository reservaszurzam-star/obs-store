import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RotateCcw,
  History,
  MapPin,
  Sparkles,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  Gem,
  CheckCircle2,
  XCircle,
  DollarSign,
  Boxes,
  PackageCheck,
  PackageX,
  TrendingDown,
  Crown
} from 'lucide-react';
import { Product, StockMovement } from '../types';

interface InventoryModuleProps {
  products: Product[];
  stockMovements: StockMovement[];
  onOpenAddProduct: () => void;
  onOpenAdjustStock: (product: Product) => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  products,
  stockMovements,
  onOpenAddProduct,
  onOpenAdjustStock,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'movements'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'stock'>('name');
  const [viewMode, setViewMode] = useState<'sections' | 'table'>('sections');

  // Categories with counts
  const categoriesWithCounts = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
  }, [products]);

  const categoriesList = useMemo(() => {
    const list = ['Aretes', 'Conjuntos', 'Collares', 'Pulseras', 'Anillos'];
    const existing = Array.from(new Set(products.map((p) => p.category)));
    const combined = Array.from(new Set([...list, ...existing]));
    return combined;
  }, [products]);

  // Extract material tags from product names/locations
  const materialsList = useMemo(() => {
    return ['Plata 950', 'Plata 925', 'Piedras Naturales'];
  }, []);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;

        let matchStock = true;
        if (stockStatusFilter === 'low') {
          matchStock = p.stock > 0 && p.stock <= p.minStock;
        } else if (stockStatusFilter === 'out') {
          matchStock = p.stock <= 0;
        } else if (stockStatusFilter === 'normal') {
          matchStock = p.stock > p.minStock;
        } else if (stockStatusFilter === 'available') {
          matchStock = p.stock > 0;
        }

        let matchMaterial = true;
        if (materialFilter !== 'all') {
          const mLower = materialFilter.toLowerCase();
          matchMaterial = p.name.toLowerCase().includes(mLower) || p.location.toLowerCase().includes(mLower);
        }

        return matchSearch && matchCategory && matchStock && matchMaterial;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'stock') return b.stock - a.stock;
        return a.name.localeCompare(b.name);
      });
  }, [products, searchQuery, categoryFilter, stockStatusFilter, materialFilter, sortBy]);

  // Low Stock Items Count
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stock <= p.minStock);
  }, [products]);

  // ===== KPI Dashboard Stats =====
  const kpis = useMemo(() => {
    const totalProducts = products.length;
    const inStock = products.filter((p) => p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock <= 0).length;
    const criticalStock = products.filter((p) => p.stock <= p.minStock).length;
    const healthyStock = products.filter((p) => p.stock > p.minStock).length;
    const totalUnits = products.reduce((acc, p) => acc + Math.max(0, p.stock), 0);
    const totalValue = products.reduce((acc, p) => acc + p.price * Math.max(0, p.stock), 0);

    // Category stock health for progress bars
    const categoryHealth = Object.keys(categoriesWithCounts).map((cat) => {
      const count: number = categoriesWithCounts[cat] || 0;
      const catProducts = products.filter((p) => p.category === cat);
      const catStock = catProducts.reduce((acc, p) => acc + Math.max(0, p.stock), 0);
      const catOut = catProducts.filter((p) => p.stock <= 0).length;
      const availablePct = count === 0 ? 0 : Math.round(((count - catOut) / count) * 100);
      return { cat, count, catStock, catOut, availablePct };
    });

    return {
      totalProducts,
      inStock,
      outOfStock,
      criticalStock,
      healthyStock,
      totalUnits,
      totalValue,
      categoryHealth,
    };
  }, [products, categoriesWithCounts]);

  // Grouped products by category for "Sections" view
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredProducts.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [filteredProducts]);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Gem className="w-5 h-5 text-[#61564A]" />
            <span>Inventario de Catálogo Obsidiana</span>
            <span className="bg-[#61564A]/10 text-[#61564A] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#61564A]/20">
              {products.length} Joyas
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestión por secciones (Aretes, Conjuntos, Collares, Pulseras, Anillos), materiales Plata 925/950 y control de existencias.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAddProduct}
            className="bg-[#181716] hover:bg-[#61564A] text-[#E4DFD7] text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer border border-[#61564A]"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Joya al Catálogo</span>
          </button>
        </div>
      </div>

      {/* KPI DASHBOARD STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Total Joyas */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Joyas</span>
            <Gem className="w-4 h-4 text-[#61564A]" />
          </div>
          <span className="text-2xl font-black text-slate-900">{kpis.totalProducts}</span>
          <span className="text-[10px] text-slate-400 font-medium">{kpis.healthyStock} en stock óptimo</span>
        </div>

        {/* En Venta / Con Stock */}
        <button
          onClick={() => { setStockStatusFilter('available'); setActiveTab('catalog'); }}
          className="bg-white border border-emerald-200 rounded-xl p-3.5 shadow-xs flex flex-col gap-1.5 hover:bg-emerald-50/40 transition-colors cursor-pointer text-left"
          title="Ver joyas disponibles"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Con Stock</span>
            <PackageCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{kpis.inStock}</span>
          <span className="text-[10px] text-emerald-600 font-medium">{kpis.totalUnits} unidades totales</span>
        </button>

        {/* Agotadas */}
        <button
          onClick={() => { setStockStatusFilter('out'); setActiveTab('catalog'); }}
          className={`bg-white border rounded-xl p-3.5 shadow-xs flex flex-col gap-1.5 hover:bg-red-50/40 transition-colors cursor-pointer text-left ${
            kpis.outOfStock > 0 ? 'border-red-200' : 'border-slate-200'
          }`}
          title="Ver joyas agotadas"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Agotadas</span>
            <PackageX className={`w-4 h-4 ${kpis.outOfStock > 0 ? 'text-red-600' : 'text-slate-400'}`} />
          </div>
          <span className="text-2xl font-black text-slate-900">{kpis.outOfStock}</span>
          <span className="text-[10px] text-slate-400 font-medium">Sin existencias</span>
        </button>

        {/* Stock Crítico */}
        <button
          onClick={() => { setStockStatusFilter('low'); setActiveTab('catalog'); }}
          className={`bg-white border rounded-xl p-3.5 shadow-xs flex flex-col gap-1.5 hover:bg-amber-50/40 transition-colors cursor-pointer text-left ${
            kpis.criticalStock > 0 ? 'border-amber-200' : 'border-slate-200'
          }`}
          title="Ver joyas en stock crítico"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Stock Crítico</span>
            <TrendingDown className={`w-4 h-4 ${kpis.criticalStock > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
          </div>
          <span className="text-2xl font-black text-slate-900">{kpis.criticalStock}</span>
          <span className="text-[10px] text-amber-600 font-medium">En o bajo mínimos</span>
        </button>

        {/* Unidades Totales */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unidades</span>
            <Boxes className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{kpis.totalUnits}</span>
          <span className="text-[10px] text-slate-400 font-medium">En almacén / tienda</span>
        </div>

        {/* Valor de Inventario */}
        <div className="bg-[#181716] border border-[#61564A] rounded-xl p-3.5 shadow-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#A59B8F] uppercase tracking-wider">Valor Stock</span>
            <DollarSign className="w-4 h-4 text-[#A59B8F]" />
          </div>
          <span className="text-xl font-black text-[#E4DFD7]">
            S/ {kpis.totalValue.toLocaleString('es-PE', { maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-[#A59B8F] font-medium">Precio × unidades</span>
        </div>
      </div>

      {/* CATEGORY HEALTH SUMMARY */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
            <Crown className="w-3.5 h-3.5 text-[#61564A]" />
            <span className="uppercase tracking-wider">Salud del Inventario por Sección</span>
          </span>
          <span className="text-[10px] text-slate-400">% de joyas disponibles en cada categoría</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {kpis.categoryHealth.map((row) => {
            const barColor =
              row.availablePct === 100
                ? 'bg-emerald-500'
                : row.availablePct >= 60
                ? 'bg-[#61564A]'
                : row.availablePct > 0
                ? 'bg-amber-500'
                : 'bg-red-500';

            return (
              <div key={row.cat} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[11px] text-slate-800">{row.cat}</span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {row.availablePct}% (Disponible: {row.count - row.catOut}/{row.count})
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${barColor} transition-all duration-500`}
                    style={{ width: `${row.availablePct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400 font-medium">
                  <span>{row.catStock} unidades</span>
                  {row.catOut > 0 && (
                    <span className="text-red-600 font-bold">{row.catOut} agotada{row.catOut > 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Low Stock Warning Alert */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs uppercase tracking-wide text-amber-900">
                Alerta de Stock Crítico ({lowStockProducts.length} productos)
              </p>
              <p className="text-xs text-amber-800">
                {lowStockProducts.map((p) => `${p.name} (${p.stock} un.)`).join(' · ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setStockStatusFilter('low'); setActiveTab('catalog'); }}
            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold rounded-lg transition-colors border border-amber-300 shrink-0 cursor-pointer"
          >
            Filtrar Stock Crítico
          </button>
        </div>
      )}

      {/* View Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 border border-slate-200 rounded-xl shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-[#181716] text-[#E4DFD7] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Catálogo Completo ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('movements')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'movements'
                ? 'bg-[#181716] text-[#E4DFD7] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial Movimientos ({stockMovements.length})</span>
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('sections')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                viewMode === 'sections'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Por Secciones</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tabla Lista</span>
            </button>
          </div>
        )}
      </div>

      {/* FILTER BAR & SECTIONS QUICK PILLS */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          
          {/* Quick Category Section Pills */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-semibold">
              <span className="flex items-center space-x-1 text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-[#61564A]" />
                <span>SECCIONES DEL CATÁLOGO</span>
              </span>
              <span className="text-[11px] text-slate-400">Selecciona para filtrar por categoría</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                  categoryFilter === 'all'
                    ? 'bg-[#61564A] text-[#E4DFD7] shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>Todas</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${categoryFilter === 'all' ? 'bg-[#181716] text-[#E4DFD7]' : 'bg-slate-200 text-slate-700'}`}>
                  {products.length}
                </span>
              </button>

              {categoriesList.map((cat) => {
                const count = categoriesWithCounts[cat] || 0;
                const isSelected = categoryFilter === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-[#61564A] text-[#E4DFD7] shadow-sm font-bold'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-[#181716] text-[#E4DFD7]' : 'bg-slate-200/80 text-slate-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre o SKU..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#61564A]"
              />
            </div>

            {/* Material Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#61564A]"
              >
                <option value="all">Todos los Materiales</option>
                {materialsList.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Availability Filter */}
            <div>
              <select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#61564A]"
              >
                <option value="all">Estado de Stock (Todos)</option>
                <option value="available">Disponibles (Stock {'>'} 0)</option>
                <option value="normal">Stock Normal</option>
                <option value="low">Stock Crítico / Bajo</option>
                <option value="out">Agotados (Stock 0)</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#61564A]"
              >
                <option value="name">Ordenar: Nombre A-Z</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="stock">Mayor Cantidad en Stock</option>
              </select>
            </div>

          </div>
        </div>
      )}

      {/* CATALOG DISPLAY (SECTIONS MODE VS TABLE MODE) */}
      {activeTab === 'catalog' && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 space-y-3">
              <Package className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600">No se encontraron joyas con los filtros seleccionados.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setMaterialFilter('all');
                  setStockStatusFilter('all');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200 cursor-pointer"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : viewMode === 'sections' ? (
            /* SECTIONS VIEW MODE */
            <div className="space-y-6">
              {(Object.entries(groupedProducts) as [string, Product[]][]).map(([catName, catProducts]) => (
                <div key={catName} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  
                  {/* Category Header */}
                  <div className="bg-[#181716] text-[#E4DFD7] px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Gem className="w-4 h-4 text-[#A59B8F]" />
                      <h2 className="font-extrabold text-sm uppercase tracking-wider">
                        {catName}
                      </h2>
                      <span className="bg-[#61564A] text-[#E4DFD7] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#A59B8F]/30">
                        {catProducts.length} productos
                      </span>
                    </div>

                    <div className="text-[11px] text-[#A59B8F] font-medium hidden sm:block">
                      Obsidiana Catálogo 2026
                    </div>
                  </div>

                  {/* Products Grid in Section */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50/50">
                    {catProducts.map((p) => {
                      const isLowStock = p.stock <= p.minStock && p.stock > 0;
                      const isOutStock = p.stock <= 0;

                      return (
                        <div
                          key={p.id}
                          className="group relative bg-white border border-slate-200 hover:border-[#61564A]/40 rounded-2xl overflow-hidden shadow-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        >
                          {/* Decorative top gradient accent */}
                          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#161716] via-[#61564A] to-[#A59B8F] opacity-80" />

                          {/* Product content */}
                          <div className="p-4">
                            {/* Top row: category badge + price */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E4DFD7] text-[#161716] border border-[#61564A]/20">
                                <Gem className="w-3 h-3 text-[#61564A]" />
                                <span>{p.category}</span>
                              </span>

                              <span className="font-black text-sm text-[#161716] bg-gradient-to-br from-slate-50 to-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-transform group-hover:scale-105">
                                S/ {p.price.toFixed(2)}
                              </span>
                            </div>

                            {/* Name + SKU */}
                            <div className="mb-3">
                              <h3 className="font-bold text-[13px] text-slate-900 leading-snug mb-1">
                                {p.name}
                              </h3>
                              <span className="font-mono text-[10px] text-blue-600 font-semibold bg-blue-50/60 px-1.5 py-0.5 rounded inline-block border border-blue-100">
                                {p.sku}
                              </span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center space-x-1 text-[11px] text-slate-500 mb-4 pb-3 border-b border-dashed border-slate-200">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{p.location}</span>
                            </div>

                            {/* Bottom row: stock status + action */}
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                {isOutStock ? (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 shadow-xs">
                                    <XCircle className="w-3 h-3" />
                                    <span>Agotado</span>
                                  </span>
                                ) : isLowStock ? (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Stock Bajo ({p.stock})</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Stock: {p.stock} un.</span>
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => onOpenAdjustStock(p)}
                                className="px-3 py-1.5 bg-[#161716] hover:bg-[#61564A] text-[#E4DFD7] rounded-lg text-[11px] font-semibold transition-all border border-[#61564A]/40 shadow-sm active:scale-95 cursor-pointer"
                              >
                                +/- Stock
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            /* COMPACT TABLE MODE */
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Producto & SKU</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Material / Ubicación</th>
                      <th className="py-3 px-4">Precio (S/)</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Ajustar</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                    {filteredProducts.map((p) => {
                      const isLowStock = p.stock <= p.minStock && p.stock > 0;
                      const isOutStock = p.stock <= 0;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{p.name}</div>
                            <div className="font-mono text-[11px] text-blue-600">{p.sku}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700 border border-slate-200">
                              {p.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-500">
                            <div className="flex items-center space-x-1 text-slate-700">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{p.location}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            S/ {p.price.toFixed(2)}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-slate-900">{p.stock}</span>
                              {isOutStock ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                                  Sin Stock
                                </span>
                              ) : isLowStock ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  Bajo (Min: {p.minStock})
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                  Disponible
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => onOpenAdjustStock(p)}
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                            >
                              + / - Stock
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Stock Movements Log Tab */}
      {activeTab === 'movements' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Fecha & Hora</th>
                  <th className="py-3 px-4">Joya / Producto</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Cantidad</th>
                  <th className="py-3 px-4">Motivo</th>
                  <th className="py-3 px-4">Registrado Por</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {stockMovements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No hay movimientos de inventario registrados.
                    </td>
                  </tr>
                ) : (
                  stockMovements.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(m.timestamp).toLocaleString('es-PE')}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {m.productName}
                      </td>
                      <td className="py-3.5 px-4">
                        {m.type === 'in' ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <ArrowDownLeft className="w-3 h-3" />
                            <span>Entrada</span>
                          </span>
                        ) : m.type === 'out' ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>Salida</span>
                          </span>
                        ) : m.type === 'alert' ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-300">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Alerta</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <RotateCcw className="w-3 h-3" />
                            <span>Ajuste</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {m.type === 'in' ? `+${m.quantity}` : m.type === 'out' ? `-${m.quantity}` : m.type === 'alert' ? '⚠' : `${m.quantity}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {m.reason}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {m.performedBy}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

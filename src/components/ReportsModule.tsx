import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Truck, 
  Package, 
  Download, 
  Award,
  CheckCircle2,
  Calendar,
  Gem,
  Sparkles,
  CreditCard,
  Printer,
  FileText
} from 'lucide-react';
import { Order, Product } from '../types';

interface ReportsModuleProps {
  orders: Order[];
  products: Product[];
}

const COLORS = ['#181716', '#61564A', '#A59B8F', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

export const ReportsModule: React.FC<ReportsModuleProps> = ({ orders, products }) => {
  const [timeRange, setTimeRange] = useState<'all' | '30days' | '7days'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter orders based on time range
  const filteredOrders = useMemo(() => {
    const now = new Date().getTime();
    return orders.filter((o) => {
      const orderTime = new Date(o.createdAt).getTime();
      if (timeRange === '7days') {
        return now - orderTime <= 7 * 24 * 60 * 60 * 1000;
      }
      if (timeRange === '30days') {
        return now - orderTime <= 30 * 24 * 60 * 60 * 1000;
      }
      return true;
    });
  }, [orders, timeRange]);

  // Key Performance Indicators (KPIs)
  const totalSales = useMemo(() => {
    return filteredOrders.reduce((acc, o) => acc + o.total, 0);
  }, [filteredOrders]);

  const totalOrders = filteredOrders.length;

  const deliveredCount = useMemo(() => {
    return filteredOrders.filter((o) => o.status === 'entregado').length;
  }, [filteredOrders]);

  const deliveredRate = totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0;

  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const totalUnitsSold = useMemo(() => {
    return filteredOrders.reduce((acc, o) => {
      return acc + o.items.reduce((sum, item) => sum + item.quantity, 0);
    }, 0);
  }, [filteredOrders]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock <= p.minStock).length;
  }, [products]);

  // Sales by Category Chart Data
  const categoryChartData = useMemo(() => {
    const map: Record<string, { category: string; sales: number; qty: number }> = {};
    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        // Find product category
        const prod = products.find((p) => p.id === item.productId || p.name === item.productName);
        const cat = prod?.category || 'General';

        if (!map[cat]) map[cat] = { category: cat, sales: 0, qty: 0 };
        map[cat].sales += item.total;
        map[cat].qty += item.quantity;
      });
    });

    return Object.values(map).sort((a, b) => b.sales - a.sales);
  }, [filteredOrders, products]);

  // Sales by Metal Purity (Plata 950 vs Plata 925)
  const metalPurityData = useMemo(() => {
    let p950Sales = 0;
    let p925Sales = 0;
    let otrosSales = 0;

    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        const nameLower = item.productName.toLowerCase();
        if (nameLower.includes('950')) {
          p950Sales += item.total;
        } else if (nameLower.includes('925')) {
          p925Sales += item.total;
        } else {
          otrosSales += item.total;
        }
      });
    });

    return [
      { name: 'Plata 950 Ley', value: p950Sales },
      { name: 'Plata 925 Ley', value: p925Sales },
      ...(otrosSales > 0 ? [{ name: 'Otros / Accesorios', value: otrosSales }] : []),
    ];
  }, [filteredOrders]);

  // Sales by Payment Method
  const paymentMethodData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const pm = o.paymentMethod || 'Otros';
      map[pm] = (map[pm] || 0) + o.total;
    });

    return Object.keys(map).map((method) => ({
      name: method,
      value: map[method],
    }));
  }, [filteredOrders]);

  // Shipments by Province Chart Data
  const provinceChartData = useMemo(() => {
    const provinceTotals: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const prov = o.customer.province || 'Lima';
      provinceTotals[prov] = (provinceTotals[prov] || 0) + o.total;
    });

    return Object.keys(provinceTotals).map((prov) => ({
      province: prov,
      sales: provinceTotals[prov],
    })).sort((a, b) => b.sales - a.sales);
  }, [filteredOrders]);

  // Revenue Trend Chart Data
  const salesTrendData = useMemo(() => {
    const trendMap: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const dateStr = new Date(o.createdAt).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
      });
      trendMap[dateStr] = (trendMap[dateStr] || 0) + o.total;
    });

    return Object.keys(trendMap).map((date) => ({
      fecha: date,
      ventas: trendMap[date],
    }));
  }, [filteredOrders]);

  // Top Selling Products
  const topProducts = useMemo(() => {
    const productSalesMap: Record<string, { name: string; sku: string; qty: number; revenue: number }> = {};
    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        const key = item.sku || item.productName;
        if (!productSalesMap[key]) {
          productSalesMap[key] = { name: item.productName, sku: item.sku || 'N/A', qty: 0, revenue: 0 };
        }
        productSalesMap[key].qty += item.quantity;
        productSalesMap[key].revenue += item.total;
      });
    });

    return Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [filteredOrders]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['OrderNumber', 'TrackingCode', 'Customer', 'Province', 'District', 'PaymentMethod', 'Total_Soles', 'Date'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      o.trackingCode,
      `"${o.customer.name}"`,
      `"${o.customer.province}"`,
      `"${o.customer.district}"`,
      `"${o.paymentMethod || 'Yape/Plin'}"`,
      o.total.toFixed(2),
      new Date(o.createdAt).toISOString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reporte_Ventas_Obsidiana_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header & Time Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#181716] text-[#E4DFD7] p-5 rounded-2xl border border-[#61564A]/50 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <Gem className="w-5 h-5 text-[#A59B8F]" />
            <h1 className="text-lg font-black tracking-wider uppercase text-[#E4DFD7]">
              Módulo de Reportes & Analítica de Joyería
            </h1>
          </div>
          <p className="text-xs text-[#A59B8F] mt-1">
            Métricas de facturación en Plata 925/950, rotación por sección (Aretes, Collares, etc.) y efectividad de envíos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Time Filter Buttons */}
          <div className="bg-[#61564A]/40 border border-[#A59B8F]/30 p-1 rounded-xl flex items-center space-x-1">
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === 'all' ? 'bg-[#E4DFD7] text-[#181716] shadow-xs' : 'text-[#A59B8F] hover:text-[#E4DFD7]'
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === '30days' ? 'bg-[#E4DFD7] text-[#181716] shadow-xs' : 'text-[#A59B8F] hover:text-[#E4DFD7]'
              }`}
            >
              Últimos 30 días
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeRange === '7days' ? 'bg-[#E4DFD7] text-[#181716] shadow-xs' : 'text-[#A59B8F] hover:text-[#E4DFD7]'
              }`}
            >
              Últimos 7 días
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="bg-[#61564A] hover:bg-[#61564A]/80 text-[#E4DFD7] border border-[#A59B8F]/40 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#A59B8F]" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total Sales */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#61564A]">Facturación Total</span>
            <div className="w-8 h-8 rounded-xl bg-[#61564A]/10 text-[#61564A] flex items-center justify-center border border-[#61564A]/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">S/ {totalSales.toFixed(2)}</p>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Total en {totalOrders} pedidos</span>
          </p>
        </div>

        {/* Card 2: Units Sold */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#61564A]">Joyas Vendidas</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">{totalUnitsSold} un.</p>
          <p className="text-[11px] text-slate-500">
            Piezas de plata entregadas
          </p>
        </div>

        {/* Card 3: Ticket Promedio */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#61564A]">Ticket Promedio</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">S/ {avgOrderValue.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500">
            Por comprobante emitido
          </p>
        </div>

        {/* Card 4: Delivered Rate */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#61564A]">Tasa de Entrega</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono">{deliveredRate}%</p>
          <p className="text-[11px] text-slate-500">
            {deliveredCount} de {totalOrders} entregados
          </p>
        </div>

        {/* Card 5: Inventory Low Stock */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#61564A]">Stock Crítico</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 font-mono">{lowStockCount}</p>
          <p className="text-[11px] text-slate-500">
            Joyas por reabastecer
          </p>
        </div>

      </div>

      {/* Visual Charts Grid 1: Sales by Category & Metal Ley */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Sales by Jewelry Category Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Gem className="w-4 h-4 text-[#61564A]" />
              <span>Ventas por Sección de Joyería (S/)</span>
            </h3>
            <span className="text-[11px] text-slate-400">Aretes, Collares, Conjuntos...</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }} 
                  formatter={(val: number) => [`S/ ${val.toFixed(2)}`, 'Ventas']}
                />
                <Bar dataKey="sales" fill="#61564A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Metal Ley Breakdown Pie Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#61564A]" />
              <span>Ventas por Ley de Metal (Plata 950 vs 925)</span>
            </h3>
          </div>

          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metalPurityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metalPurityData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }} 
                  formatter={(val: number) => [`S/ ${val.toFixed(2)}`, 'Ventas']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs pt-2 border-t border-slate-100">
            {metalPurityData.map((mp, i) => (
              <div key={mp.name} className="flex items-center space-x-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-slate-700 font-bold">{mp.name}: S/ {mp.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Visual Charts Grid 2: Revenue Trend & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Trend Area Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Evolución Diaria de Ventas (S/)</span>
            </h3>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="fecha" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }} 
                  formatter={(val: number) => [`S/ ${val.toFixed(2)}`, 'Ventas']}
                />
                <Area type="monotone" dataKey="ventas" stroke="#10b981" fill="#10b98120" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Métodos de Pago Preferidos</span>
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {paymentMethodData.map((pm, idx) => {
              const percent = totalSales > 0 ? Math.round((pm.value / totalSales) * 100) : 0;

              return (
                <div key={pm.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{pm.name}</span>
                    <span className="font-mono">S/ {pm.value.toFixed(2)} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#181716] rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Top Products Ranking Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Top Joyas Más Vendidas (Ranking de Ventas)</span>
          </h3>
          <span className="text-[11px] text-slate-400">Basado en comprobantes generados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-4">SKU</th>
                <th className="py-2.5 px-4">Joya / Descripción</th>
                <th className="py-2.5 px-4">Unidades Vendidas</th>
                <th className="py-2.5 px-4 text-right">Ingresos Generados (S/)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {topProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-blue-600 font-bold">{p.sku}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{p.qty} un.</td>
                  <td className="py-3 px-4 font-black text-emerald-600 font-mono text-right">S/ {p.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

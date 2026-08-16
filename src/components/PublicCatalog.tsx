import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, MessageCircle, Diamond, Filter, ArrowRight, X, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface PublicCatalogProps {
  products: Product[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

const ProductImage = ({ product }: { product: Product }) => {
  const [hasError, setHasError] = useState(false);

  if (!product.imageUrl || hasError) {
    return <Diamond className="w-16 h-16 text-[#A59B8F]/40 group-hover:scale-110 transition-transform duration-700 ease-out" />;
  }

  return (
    <>
      <img 
        src={product.imageUrl} 
        alt={product.name}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out mix-blend-multiply ${product.hoverImageUrl ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
        onError={() => setHasError(true)}
      />
      {product.hoverImageUrl && (
        <img 
          src={product.hoverImageUrl} 
          alt={`${product.name} - detalle`}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out mix-blend-multiply opacity-0 group-hover:opacity-100 group-hover:scale-105"
        />
      )}
    </>
  );
};

export const PublicCatalog: React.FC<PublicCatalogProps> = ({ products }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };
  
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => (p.stock ?? 0) >= 0) // show all products including stock 0
      .filter((p) => {
        const matchSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.sku ?? '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
        return matchSearch && matchCategory;
      });
  }, [products, searchQuery, categoryFilter]);

  const categories = useMemo(() => {
    const order = ['Aretes', 'Conjuntos', 'Collares', 'Pulseras', 'Anillos'];
    const existing = Array.from(new Set(products.map(p => p.category)));
    const sorted = order.filter(c => existing.includes(c));
    const rest = existing.filter(c => !order.includes(c));
    return ['all', ...sorted, ...rest];
  }, [products]);

  const whatsappNumber = '51906313634';

  const handleCheckout = () => {
    let text = `Hola Obsidiana, deseo adquirir los siguientes productos:\n\n`;
    cart.forEach(item => {
      text += `- ${item.quantity}x ${item.product.name} (SKU: ${item.product.sku}) - S/ ${(item.product.price * item.quantity).toFixed(2)}\n`;
    });
    text += `\nTotal estimado: S/ ${cartTotal.toFixed(2)}\n¿Siguen disponibles?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-zinc-900 font-sans selection:bg-[#E4DFD7] selection:text-zinc-900 pb-20">
      
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full bg-[#FDFCFB]/80 backdrop-blur-md z-50 border-b border-[#E4DFD7]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#181716] rounded-sm flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src="/assets/Icono/icono-negro.jpeg" 
                alt="Obsidiana Logo" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                }} 
              />
              <Diamond className="w-5 h-5 text-[#E4DFD7] hidden" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-[#181716]">Obsidiana</h1>
              <p className="text-[9px] text-[#A59B8F] font-medium tracking-[0.3em] uppercase mt-0.5">Plata & Joyería</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#181716] uppercase hover:text-[#A59B8F] transition-colors relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Bolsa</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 md:static md:-top-auto md:-right-auto bg-[#181716] text-[#FDFCFB] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section Editorial */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <p className="text-xs font-semibold tracking-[0.4em] text-[#A59B8F] uppercase">
            Nueva Temporada
          </p>
          <h2 className="text-5xl md:text-7xl font-light text-[#181716] tracking-tighter">
            Elegancia <span className="italic font-serif text-[#61564A]">Atemporal</span>
          </h2>
          <p className="max-w-xl mx-auto text-[#61564A] font-light leading-relaxed text-sm md:text-base">
            Descubre nuestra selección curada de piezas en Plata 925 y 950. 
            Diseños creados para resaltar tu esencia en cada momento.
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda Refinados */}
      <div className="max-w-7xl mx-auto px-6 py-10 sticky top-20 z-40 bg-[#FDFCFB]/95 backdrop-blur-sm border-y border-[#E4DFD7]/40 mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          
          <div className="flex gap-6 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[11px] font-bold tracking-[0.15em] uppercase transition-all whitespace-nowrap pb-1 relative ${
                  categoryFilter === cat
                    ? 'text-[#181716] border-b-2 border-[#181716]'
                    : 'text-[#A59B8F] hover:text-[#61564A]'
                }`}
              >
                {cat === 'all' ? 'Toda la Colección' : cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar pieza o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-0 pr-8 py-2 bg-transparent border-b border-[#E4DFD7] text-sm text-[#181716] placeholder-[#A59B8F] focus:outline-none focus:border-[#181716] transition-colors rounded-none"
            />
            <Search className="w-4 h-4 text-[#A59B8F] absolute right-0 top-1/2 -translate-y-1/2" />
          </div>

        </div>
      </div>

      {/* Product Grid Minimalista */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <Filter className="w-10 h-10 text-[#E4DFD7] mx-auto mb-6" />
            <h3 className="text-sm font-medium tracking-widest uppercase text-[#181716]">Sin Resultados</h3>
            <p className="text-[#A59B8F] mt-3 font-light text-sm">Explora otras categorías o términos de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                
                {/* Cuadro de Imagen Elegante */}
                <div className="aspect-[4/5] bg-[#E4DFD7]/20 relative flex items-center justify-center p-8 mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.03] transition-colors duration-500 z-10" />
                  
                  <ProductImage product={product} />
                  
                  {/* Etiqueta Flotante Sutil */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="text-[9px] font-bold tracking-widest text-[#61564A] uppercase bg-[#FDFCFB] px-3 py-1 shadow-sm">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Info del Producto */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-sm font-medium text-[#181716] leading-snug">
                      {product.name}
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-semibold text-[#181716]">
                        S/ {product.price.toFixed(2)}
                      </span>
                      {product.stock <= 0 && (
                        <p className="text-[9px] font-bold tracking-widest text-red-400 uppercase mt-0.5">Agotado</p>
                      )}
                    </div>
                  </div>

                  {/* Material */}
                  <p className="text-[10px] text-[#A59B8F] font-light tracking-wider uppercase">
                    {(product as any).material || product.category}
                  </p>

                  {/* Botón Agregar a la Bolsa */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.stock > 0) addToCart(product);
                    }}
                    disabled={product.stock <= 0}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-[#181716] text-[#181716] hover:bg-[#181716] hover:text-[#FDFCFB] transition-all duration-300 text-[10px] font-bold tracking-[0.2em] uppercase mt-3 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#181716]"
                  >
                    <span>{product.stock <= 0 ? 'Agotado' : 'Agregar a la Bolsa'}</span>
                    {product.stock > 0 && <Plus className="w-3 h-3" />}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Minimalista */}
      <footer className="max-w-7xl mx-auto px-6 mt-32 pt-12 border-t border-[#E4DFD7]/40 text-center">
        <Diamond className="w-6 h-6 text-[#A59B8F] mx-auto mb-6" />
        <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#61564A]">Obsidiana Joyería</p>
        <p className="text-xs text-[#A59B8F] font-light mt-3">Exclusividad en cada detalle.</p>
      </footer>

      {/* Cart Slide-over */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-[#181716]/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          
          <div className="relative w-full md:w-[400px] bg-[#FDFCFB] h-full shadow-2xl flex flex-col border-l border-[#E4DFD7]/50">
            {/* Header */}
            <div className="h-20 px-6 flex items-center justify-between border-b border-[#E4DFD7]/50">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-[#181716]">Tu Bolsa</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-[#A59B8F] hover:text-[#181716] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-12 h-12 text-[#E4DFD7] mb-4" />
                  <p className="text-sm tracking-widest text-[#181716] uppercase">Tu bolsa está vacía</p>
                  <p className="text-xs text-[#A59B8F] mt-2 font-light">Descubre nuestras piezas de temporada.</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#181716] border-b border-[#181716] pb-1">Continuar explorando</button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-20 h-24 bg-[#E4DFD7]/20 flex-shrink-0 flex items-center justify-center relative">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" />
                      ) : (
                        <Diamond className="w-6 h-6 text-[#A59B8F]/40" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xs font-semibold text-[#181716] mb-1">{item.product.name}</h3>
                      <p className="text-[10px] text-[#A59B8F] uppercase tracking-widest mb-3">S/ {item.product.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-[#E4DFD7]">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1.5 text-[#A59B8F] hover:text-[#181716]">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs text-[#181716] font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1.5 text-[#A59B8F] hover:text-[#181716]">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#FDFCFB] border-t border-[#E4DFD7]/50">
                <div className="flex items-center justify-between mb-6 text-sm">
                  <span className="font-bold tracking-[0.1em] uppercase text-[#181716]">Subtotal</span>
                  <span className="font-bold text-[#181716]">S/ {cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-[#181716] text-[#FDFCFB] py-4 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#61564A] transition-colors flex items-center justify-center gap-3"
                >
                  <span>Finalizar Pedido</span>
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

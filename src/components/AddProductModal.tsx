import React, { useState } from 'react';
import { X, Package, Plus, AlertCircle } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (productData: {
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    minStock: number;
    location: string;
  }) => Promise<void>;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Aretes');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [minStock, setMinStock] = useState<number | ''>(5);
  const [location, setLocation] = useState('Vitrina Principal');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || price === '' || Number(price) <= 0) {
      setErrorMsg('Por favor ingresa un nombre y precio mayor a 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddProduct({
        name,
        sku: sku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        category,
        price: Number(price),
        stock: Number(stock || 0),
        minStock: Number(minStock || 5),
        location,
      });

      // Reset
      setName('');
      setSku('');
      setPrice('');
      setStock('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-zinc-200 rounded-sm w-full max-w-lg shadow-2xl text-zinc-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-sm bg-zinc-100 text-zinc-900 flex items-center justify-center border border-zinc-200">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-medium tracking-wide text-zinc-900 uppercase">Nueva Joya</h2>
              <p className="text-xs text-zinc-500 font-light">Registra un nuevo artículo en tu catálogo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 p-2 rounded-sm hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Nombre de la Joya *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Collar de Plata 950 con Cuarzo Rosa"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">SKU / Código</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej. COL-950-ROS"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              >
                <option value="Aretes">Aretes</option>
                <option value="Collares">Collares</option>
                <option value="Pulseras">Pulseras</option>
                <option value="Anillos">Anillos</option>
                <option value="Conjuntos">Conjuntos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Precio (S/) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.00"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Stock Inicial</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Stock Mínimo</label>
              <input
                type="number"
                min="1"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="5"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Ubicación</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Vitrina 1 - Exhibidor A"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
            />
          </div>

          {/* Submit */}
          <div className="pt-6 mt-4 border-t border-zinc-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-sm text-xs font-semibold transition-colors uppercase tracking-widest cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-sm text-xs shadow-sm disabled:opacity-50 transition-all flex items-center space-x-2 uppercase tracking-widest cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Crear Joya'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

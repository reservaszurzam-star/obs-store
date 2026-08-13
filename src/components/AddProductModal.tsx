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
  const [category, setCategory] = useState('Tecnología');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [minStock, setMinStock] = useState<number | ''>(5);
  const [location, setLocation] = useState('Almacén Principal - Estante A');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg shadow-xl text-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Nuevo Producto en Inventario</h2>
              <p className="text-xs text-slate-500">Registra un nuevo artículo para catálogo y control de stock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nombre del Producto *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Monitor Curved 34' 4K OLED"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">SKU / Código</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej. MON-34-OLED"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="Tecnología">Tecnología</option>
                <option value="Audio & Sonido">Audio & Sonido</option>
                <option value="Mobiliario de Oficina">Mobiliario de Oficina</option>
                <option value="Periféricos">Periféricos</option>
                <option value="Monitores">Monitores</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Precio Unitario (S/) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.00"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Stock Inicial</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Stock Mínimo Alerta</label>
              <input
                type="number"
                min="1"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="5"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Ubicación en Almacén</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Almacén Central - Rack B4"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs disabled:opacity-50 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Crear Producto'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

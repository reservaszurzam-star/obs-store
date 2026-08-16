import React, { useState, useRef } from 'react';
import { X, Package, Plus, AlertCircle, Image, Upload, Gem } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (productData: {
    name: string;
    sku: string;
    category: string;
    material: string;
    price: number;
    stock: number;
    minStock: number;
    location: string;
    description: string;
    imageUrl: string;
  }) => Promise<void>;
}

const CATEGORIES = ['Aretes', 'Conjuntos', 'Collares', 'Pulseras', 'Anillos'];
const MATERIALS = ['Plata 950', 'Plata 925', 'Plata 950 con Piedra Natural', 'Plata 925 con Piedra Natural'];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Aretes');
  const [material, setMaterial] = useState('Plata 950');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>(0);
  const [minStock, setMinStock] = useState<number | ''>(5);
  const [location, setLocation] = useState('Vitrina Principal');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Auto-generate SKU from category + name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!sku) {
      const catPrefix = category.substring(0, 3).toUpperCase();
      const nameSlug = val.trim().substring(0, 4).toUpperCase().replace(/\s/g, '');
      if (nameSlug.length >= 2) {
        setSku(`OBS-${catPrefix}-${nameSlug}`);
      }
    }
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    // Update SKU prefix if name already set
    if (name) {
      const catPrefix = val.substring(0, 3).toUpperCase();
      const nameSlug = name.trim().substring(0, 4).toUpperCase().replace(/\s/g, '');
      setSku(`OBS-${catPrefix}-${nameSlug}`);
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = `/productos/${file.name}`;
    setImageUrl(localUrl);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (val: string) => {
    setImageUrl(val);
    setImagePreview(val.startsWith('http') || val.startsWith('/') ? val : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || price === '' || Number(price) <= 0) {
      setErrorMsg('Por favor ingresa un nombre y precio válido (mayor a 0).');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddProduct({
        name: name.trim(),
        sku: sku.trim() || `OBS-${category.substring(0,3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        category,
        material,
        price: Number(price),
        stock: Number(stock || 0),
        minStock: Number(minStock || 5),
        location,
        description,
        imageUrl,
      });

      // Reset form
      setName(''); setSku(''); setPrice(''); setStock(0);
      setDescription(''); setImageUrl(''); setImagePreview('');
      setCategory('Aretes'); setMaterial('Plata 950');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-900/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white border border-zinc-200 rounded-sm w-full max-w-2xl shadow-2xl text-zinc-800 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-sm bg-zinc-900 text-white flex items-center justify-center">
              <Gem className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Nueva Joya al Catálogo</h2>
              <p className="text-xs text-zinc-500 font-light">Registra un artículo nuevo con todos sus detalles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 p-1.5 rounded-sm hover:bg-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Nombre + SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                Nombre de la Joya *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej. Corazón Amazonita"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                SKU / Código
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej. OBS-COL-026"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              />
              <p className="text-[10px] text-zinc-400 mt-1">Se genera automático si lo dejas vacío</p>
            </div>
          </div>

          {/* Categoría + Material */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                Categoría *
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-all ${
                      category === cat
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                Material *
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              >
                {MATERIALS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Precio + Stock + Stock Mínimo */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                Precio (S/) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.00"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                Stock Inicial
              </label>
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
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
                Stock Mínimo
              </label>
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

          {/* Descripción */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
              Descripción (materiales, cadena, etc.)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Ej. Dije de Plata 950 con Piedra Natural - Cadena Pancer de Plata 950 (45cm)"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors resize-none"
            />
          </div>

          {/* Foto del producto */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
              Foto del Producto
            </label>
            <div className="flex gap-3">
              {/* Preview */}
              <div className="w-24 h-24 shrink-0 bg-zinc-100 border border-zinc-200 rounded-sm flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-6 h-6 text-zinc-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                {/* URL manual */}
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="/productos/prod-col-027.jpeg  ó  https://..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
                />
                {/* Subir archivo */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 text-xs font-semibold text-zinc-600 border border-zinc-200 rounded-sm px-3 py-2 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Seleccionar archivo local</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
                <p className="text-[10px] text-zinc-400">
                  Pega la ruta o URL de la foto, o selecciona un archivo para previsualizar.
                </p>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">
              Ubicación en tienda
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Vitrina Principal - Aretes"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-sm px-3 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
            />
          </div>

          {/* Botones */}
          <div className="pt-4 border-t border-zinc-100 flex justify-end space-x-3">
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
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-sm text-xs shadow-sm disabled:opacity-50 transition-all flex items-center space-x-2 uppercase tracking-widest cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : 'Agregar al Catálogo'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

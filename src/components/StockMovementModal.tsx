import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, RotateCcw, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface StockMovementModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAdjustStock: (
    productId: string,
    quantity: number,
    type: 'in' | 'out' | 'adjustment',
    reason: string,
    performedBy: string
  ) => Promise<void>;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  isOpen,
  product,
  onClose,
  onAdjustStock,
}) => {
  const [type, setType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [reason, setReason] = useState('Reabastecimiento de proveedor');
  const [performedBy, setPerformedBy] = useState('Supervisión de Almacén');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (quantity === '' || Number(quantity) <= 0) {
      setErrorMsg('Ingresa una cantidad válida mayor a 0.');
      return;
    }

    if (type === 'out' && Number(quantity) > product.stock) {
      setErrorMsg(`No puedes retirar más de ${product.stock} unidades en stock.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdjustStock(product.id, Number(quantity), type, reason, performedBy);
      setQuantity('');
      setReason('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al ajustar stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md shadow-xl text-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <h2 className="text-base font-bold text-slate-900">Movimiento de Inventario</h2>
            <p className="text-xs text-blue-600 font-medium">{product.name} (Stock: {product.stock})</p>
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

          {/* Type Selector Tabs */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Tipo de Movimiento</label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-50 border border-slate-200 rounded-lg">
              <button
                type="button"
                onClick={() => { setType('in'); setReason('Reabastecimiento de proveedor'); }}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition-all ${
                  type === 'in' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Entrada</span>
              </button>

              <button
                type="button"
                onClick={() => { setType('out'); setReason('Merma / Salida de almacén'); }}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition-all ${
                  type === 'out' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Salida</span>
              </button>

              <button
                type="button"
                onClick={() => { setType('adjustment'); setReason('Conteo físico de inventario'); }}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition-all ${
                  type === 'adjustment' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ajuste</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {type === 'adjustment' ? 'Nuevo Stock Total Exacto *' : 'Cantidad a Mover *'}
            </label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Ej. 10"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Motivo u Observación *</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej. Guía de Remisión #8492"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Responsable</label>
            <input
              type="text"
              value={performedBy}
              onChange={(e) => setPerformedBy(e.target.value)}
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Movimiento'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

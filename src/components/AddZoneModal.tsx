import React, { useState } from 'react';
import { X, MapPin, Plus, AlertCircle } from 'lucide-react';
import { Province } from '../types';

interface AddZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  provinces: Province[];
  onAddZone: (zoneData: {
    name: string;
    provinceId: string;
    shippingFee: number;
    estimatedDays: string;
    courierAssigned: string;
  }) => Promise<void>;
}

export const AddZoneModal: React.FC<AddZoneModalProps> = ({
  isOpen,
  onClose,
  provinces,
  onAddZone,
}) => {
  const [name, setName] = useState('');
  const [provinceId, setProvinceId] = useState(provinces[0]?.id || '');
  const [shippingFee, setShippingFee] = useState<number | ''>(15.00);
  const [estimatedDays, setEstimatedDays] = useState('24 - 48 hrs');
  const [courierAssigned, setCourierAssigned] = useState('Courier Local Expreso');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || shippingFee === '' || Number(shippingFee) < 0) {
      setErrorMsg('Por favor ingresa un nombre válido y tarifa de envío mayor o igual a 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddZone({
        name,
        provinceId,
        shippingFee: Number(shippingFee),
        estimatedDays,
        courierAssigned,
      });

      setName('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar la zona.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md shadow-xl text-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Nueva Zona de Envío</h2>
              <p className="text-xs text-slate-500">Tarifas y tiempos de entrega por región</p>
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
            <label className="block text-xs font-medium text-slate-700 mb-1">Nombre de la Zona *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Lima Sur Expreso o Piura Urbana"
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Provincia Pertenece</label>
            <select
              value={provinceId}
              onChange={(e) => setProvinceId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
            >
              {provinces.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name} ({prov.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tarifa Envío (S/) *</label>
              <input
                type="number"
                step="0.50"
                required
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="15.00"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tiempo Estimado</label>
              <input
                type="text"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                placeholder="24-48 hrs"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Courier / Empresa Asignada</label>
            <input
              type="text"
              value={courierAssigned}
              onChange={(e) => setCourierAssigned(e.target.value)}
              placeholder="Ej. Motorizados Express SAC"
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
              <span>{isSubmitting ? 'Guardando...' : 'Crear Zona'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

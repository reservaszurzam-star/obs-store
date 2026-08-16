import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Building2, 
  Compass,
  DollarSign,
  Trash2,
  Edit2
} from 'lucide-react';
import { Province, District, Zone } from '../types';

interface ShippingZonesModuleProps {
  provinces: Province[];
  districts: District[];
  zones: Zone[];
  onOpenAddZone: () => void;
  onAddDistrict: (districtData: { name: string; provinceId: string; zoneId: string }) => Promise<void>;
  onDeleteZone?: (zoneId: string) => Promise<void>;
  onUpdateZone?: (zoneId: string, updates: Partial<Zone>) => Promise<void>;
  onDeleteDistrict?: (districtId: string) => Promise<void>;
}

export const ShippingZonesModule: React.FC<ShippingZonesModuleProps> = ({
  provinces,
  districts,
  zones,
  onOpenAddZone,
  onAddDistrict,
  onDeleteZone,
  onUpdateZone,
  onDeleteDistrict,
}) => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>(provinces[0]?.id || '');
  const [newDistName, setNewDistName] = useState('');
  const [newDistZoneId, setNewDistZoneId] = useState('');
  const [isAddingDist, setIsAddingDist] = useState(false);

  // Selected Province Object
  const currentProvince = provinces.find((p) => p.id === selectedProvinceId);

  // Zones for current province
  const currentZones = zones.filter((z) => z.provinceId === selectedProvinceId);

  // Districts for current province
  const currentDistricts = districts.filter((d) => d.provinceId === selectedProvinceId);

  const handleCreateDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistName.trim() || !newDistZoneId) return;

    setIsAddingDist(true);
    try {
      await onAddDistrict({
        name: newDistName.trim(),
        provinceId: selectedProvinceId,
        zoneId: newDistZoneId,
      });
      setNewDistName('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingDist(false);
    }
  };

  const handleEditZonePrice = (zone: Zone) => {
    if (!onUpdateZone) return;
    const newPrice = prompt(`Editar tarifa para "${zone.name}" (S/):`, zone.shippingFee.toString());
    if (newPrice !== null && !isNaN(Number(newPrice))) {
      onUpdateZone(zone.id, { shippingFee: Number(newPrice) });
    }
  };

  const handleDeleteZoneClick = (zone: Zone) => {
    if (!onDeleteZone) return;
    if (window.confirm(`¿Estás seguro que deseas ELIMINAR la zona "${zone.name}"? Los distritos asociados también se eliminarán o quedarán sin zona.`)) {
      onDeleteZone(zone.id);
    }
  };

  const handleDeleteDistrictClick = (district: District) => {
    if (!onDeleteDistrict) return;
    if (window.confirm(`¿Eliminar distrito "${district.name}"?`)) {
      onDeleteDistrict(district.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>Gestión de Envíos por Zonas, Distritos & Provincias</span>
            <span className="bg-blue-50 text-blue-600 text-xs px-2.5 py-0.5 rounded-full border border-blue-200">
              {provinces.length} Provincias
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configura coberturas geográficas, tarifas en Soles (S/), tiempos de tránsito y empresas courier por zona.
          </p>
        </div>

        <button
          onClick={onOpenAddZone}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center space-x-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Nueva Zona</span>
        </button>
      </div>

      {/* Province Tabs Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {provinces.map((prov) => {
          const isSelected = prov.id === selectedProvinceId;
          const zoneCount = zones.filter((z) => z.provinceId === prov.id).length;

          return (
            <button
              key={prov.id}
              onClick={() => setSelectedProvinceId(prov.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-2 border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{prov.name}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {zoneCount} Zonas
              </span>
            </button>
          );
        })}
      </div>

      {/* Zones Table for Selected Province */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Zones & Rates */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Zonas y Tarifas de Despacho en {currentProvince?.name}</span>
                </h3>
              </div>
              <span className="text-xs text-slate-500">Código: {currentProvince?.code}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Zona de Cobertura</th>
                    <th className="py-3 px-4">Tarifa Envío</th>
                    <th className="py-3 px-4">Tiempo Tránsito</th>
                    <th className="py-3 px-4">Courier Asignado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {currentZones.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No hay zonas configuradas para esta provincia todavía.
                      </td>
                    </tr>
                  ) : (
                    currentZones.map((z) => (
                      <tr key={z.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {z.name}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-blue-600">
                          S/ {z.shippingFee.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{z.estimatedDays}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <span className="flex items-center space-x-1">
                            <Truck className="w-3 h-3 text-slate-400" />
                            <span>{z.courierAssigned}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditZonePrice(z)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Editar Tarifa"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteZoneClick(z)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Eliminar Zona"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: District Mapping & Add District */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-4 h-4" />
              <span>Distritos en {currentProvince?.name} ({currentDistricts.length})</span>
            </h3>

            {/* Districts List Tags */}
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {currentDistricts.map((d) => {
                const zObj = zones.find((z) => z.id === d.zoneId);
                return (
                  <div
                    key={d.id}
                    className="flex flex-col bg-slate-50 border border-slate-200 rounded-lg p-2 text-[11px] group relative pr-6"
                  >
                    <span className="font-bold text-slate-800">{d.name}</span>
                    <span className="text-slate-500 truncate w-24" title={zObj?.name}>
                      {zObj?.name || 'Sin Zona'}
                    </span>
                    <button
                      onClick={() => handleDeleteDistrictClick(d)}
                      className="absolute right-1.5 top-1.5 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
              {currentDistricts.length === 0 && (
                <span className="text-xs text-slate-400">Sin distritos registrados.</span>
              )}
            </div>

            {/* Add District Form */}
            <div className="pt-4 border-t border-slate-100">
              <form onSubmit={handleCreateDistrict} className="space-y-3">
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                  Mapear Nuevo Distrito
                </h4>
                
                <div>
                  <input
                    type="text"
                    required
                    value={newDistName}
                    onChange={(e) => setNewDistName(e.target.value)}
                    placeholder="Ej. Miraflores, Yanahuara..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <select
                    required
                    value={newDistZoneId}
                    onChange={(e) => setNewDistZoneId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="" disabled>Selecciona la Zona Correspondiente</option>
                    {currentZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} - S/ {z.shippingFee.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isAddingDist || currentZones.length === 0}
                  className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Distrito a {currentProvince?.name}</span>
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

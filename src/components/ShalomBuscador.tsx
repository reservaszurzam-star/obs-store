import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SHALOM_AGENCIAS, SHALOM_DEPARTAMENTOS, AgenciaShalom } from '../data/shalomAgencias';
import { Search, MapPin, X, ChevronDown } from 'lucide-react';

interface ShalomBuscadorProps {
  onSelect: (agencia: AgenciaShalom) => void;
  selectedNombre?: string;
}

export const ShalomBuscador: React.FC<ShalomBuscadorProps> = ({ onSelect, selectedNombre }) => {
  const [query, setQuery] = useState('');
  const [deptoFilter, setDeptoFilter] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return SHALOM_AGENCIAS.filter((a) => {
      const matchDepto = !deptoFilter || a.departamento === deptoFilter;
      const matchQuery =
        !q ||
        a.nombre.toLowerCase().includes(q) ||
        a.departamento.toLowerCase().includes(q) ||
        a.provincia.toLowerCase().includes(q) ||
        a.distrito.toLowerCase().includes(q) ||
        a.direccion.toLowerCase().includes(q);
      return matchDepto && matchQuery;
    }).slice(0, 40); // max 40 results shown
  }, [query, deptoFilter]);

  const handleSelect = (a: AgenciaShalom) => {
    onSelect(a);
    setQuery('');
    setDeptoFilter('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="space-y-1.5 relative">
      <div className="flex items-center justify-between">
        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
          Sede Shalom de Destino
          <span className="ml-1 text-slate-400 font-normal normal-case">(475 sedes)</span>
        </p>
        <a
          href="https://agencias.shalom.pe"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[8px] font-bold text-blue-600 hover:underline"
        >
          🔍 Buscador oficial ↗
        </a>
      </div>

      {/* Selected display */}
      {selectedNombre && !isOpen && (
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1.5">
          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="text-[9px] text-emerald-700 font-bold flex-1 leading-tight">{selectedNombre}</span>
          <button
            type="button"
            onClick={() => { onSelect({ nombre: '', departamento: '', provincia: '', distrito: '', direccion: '', referencia: '', horario: '' }); setIsOpen(true); }}
            className="text-emerald-400 hover:text-emerald-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Search trigger */}
      {(!selectedNombre || isOpen) && (
        <div
          className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-1.5 cursor-text focus-within:border-[#61564A] transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <Search className="w-3 h-3 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar ciudad, distrito o dirección…"
            className="flex-1 text-xs text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Department filter chips */}
      {isOpen && (
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setDeptoFilter('')}
            className={`px-2 py-0.5 rounded-full border text-[8px] font-bold cursor-pointer transition-all ${
              !deptoFilter ? 'bg-[#61564A] text-white border-[#61564A]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#61564A]/60'
            }`}
          >
            Todos
          </button>
          {SHALOM_DEPARTAMENTOS.filter(d => d !== 'Lima' && d !== 'Callao').slice(0, 12).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDeptoFilter(d === deptoFilter ? '' : d)}
              className={`px-2 py-0.5 rounded-full border text-[8px] font-bold cursor-pointer transition-all ${
                deptoFilter === d ? 'bg-[#61564A] text-white border-[#61564A]' : 'bg-white text-slate-600 border-slate-200 hover:border-[#61564A]/60'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {/* Results dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-center text-[10px] text-slate-400">
              Sin resultados. Prueba otro término o departamento.
            </div>
          ) : (
            <>
              <div className="px-2 py-1 border-b border-slate-100 text-[8px] text-slate-400 font-medium">
                {filtered.length === 40 ? 'Mostrando 40 de muchos resultados – filtra para precisar' : `${filtered.length} sede${filtered.length !== 1 ? 's' : ''} encontrada${filtered.length !== 1 ? 's' : ''}`}
              </div>
              {filtered.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(a)}
                  className="w-full text-left px-3 py-2 hover:bg-[#E4DFD7]/50 transition-colors flex items-start gap-2 border-b border-slate-50 last:border-0"
                >
                  <MapPin className="w-3 h-3 text-[#A59B8F] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-800 truncate">{a.nombre}</p>
                    <p className="text-[8px] text-[#61564A] font-semibold">{a.departamento} › {a.provincia} › {a.distrito}</p>
                    <p className="text-[8px] text-slate-500 truncate">{a.direccion}</p>
                    {a.referencia && (
                      <p className="text-[7px] text-slate-400 italic truncate">{a.referencia}</p>
                    )}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Check, X, Search, ExternalLink, Compass, AlertCircle, Sparkles, ClipboardPaste } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface MapLocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCoords: { lat: number; lng: number } | null;
  initialAddress?: string;
  onSelectCoords: (coords: { lat: number; lng: number }, addressSnippet?: string) => void;
}

// Default Lima, Peru coordinates
const DEFAULT_LIMA = { lat: -12.046374, lng: -77.042793 };

// Common Peru District & City Dictionary for offline / fast search
const PERU_LOCATIONS_DICT: Record<string, { lat: number; lng: number; name: string }> = {
  'lima': { lat: -12.046374, lng: -77.042793, name: 'Lima Centro' },
  'surco': { lat: -12.128, lng: -76.985, name: 'Santiago de Surco' },
  'santiago de surco': { lat: -12.128, lng: -76.985, name: 'Santiago de Surco' },
  'miraflores': { lat: -12.1211, lng: -77.0305, name: 'Miraflores' },
  'san isidro': { lat: -12.0975, lng: -77.0363, name: 'San Isidro' },
  'lince': { lat: -12.0894, lng: -77.0335, name: 'Lince' },
  'san borja': { lat: -12.0872, lng: -77.0003, name: 'San Borja' },
  'la molina': { lat: -12.0805, lng: -76.9465, name: 'La Molina' },
  'san miguel': { lat: -12.0772, lng: -77.0872, name: 'San Miguel' },
  'callao': { lat: -12.0566, lng: -77.1181, name: 'Callao' },
  'jesús maría': { lat: -12.0768, lng: -77.0458, name: 'Jesús María' },
  'jesus maria': { lat: -12.0768, lng: -77.0458, name: 'Jesús María' },
  'magdalena': { lat: -12.0911, lng: -77.0708, name: 'Magdalena del Mar' },
  'pueblo libre': { lat: -12.0744, lng: -77.0633, name: 'Pueblo Libre' },
  'barranco': { lat: -12.1417, lng: -77.0208, name: 'Barranco' },
  'ate': { lat: -12.0264, lng: -76.9181, name: 'Ate Vitarte' },
  'los olivos': { lat: -11.9706, lng: -77.0708, name: 'Los Olivos' },
  'san martin de porres': { lat: -12.0153, lng: -77.0825, name: 'San Martín de Porres' },
  'chorrillos': { lat: -12.1764, lng: -77.0167, name: 'Chorrillos' },
  'cusco': { lat: -13.5319, lng: -71.9675, name: 'Cusco' },
  'cuzco': { lat: -13.5319, lng: -71.9675, name: 'Cusco' },
  'arequipa': { lat: -16.409, lng: -71.5375, name: 'Arequipa' },
  'trujillo': { lat: -8.1116, lng: -79.0286, name: 'Trujillo' },
  'chiclayo': { lat: -6.7714, lng: -79.8409, name: 'Chiclayo' },
  'piura': { lat: -5.1945, lng: -80.6328, name: 'Piura' },
  'huancayo': { lat: -12.0651, lng: -75.2049, name: 'Huancayo' },
  'ica': { lat: -14.0678, lng: -75.7286, name: 'Ica' },
  'tacna': { lat: -18.0146, lng: -70.2536, name: 'Tacna' },
  'puno': { lat: -15.8402, lng: -70.0219, name: 'Puno' },
  'cajamarca': { lat: -7.1617, lng: -78.5128, name: 'Cajamarca' },
  'pucallpa': { lat: -8.3791, lng: -74.5539, name: 'Pucallpa' },
  'iquitos': { lat: -3.7491, lng: -73.2538, name: 'Iquitos' },
};

/**
 * Parses coordinates from text strings like:
 * - "-12.0894, -77.0335"
 * - "-12.0894 -77.0335"
 * - "https://www.google.com/maps/@-12.0894,-77.0335,17z"
 * - "https://maps.google.com/?q=-12.0894,-77.0335"
 */
export const parseCoordinatesFromText = (input: string): { lat: number; lng: number } | null => {
  if (!input) return null;
  const str = input.trim();

  // 1. Google Maps URL match
  const urlMatch =
    str.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    str.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    str.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);

  if (urlMatch) {
    const lat = parseFloat(urlMatch[1]);
    const lng = parseFloat(urlMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
  }

  // 2. Direct decimal coordinates pattern: e.g. -12.0894, -77.0335
  const coordsRegex = /(-?\d{1,2}\.\d+)\s*[\s,;:\/]\s*(-?\d{1,3}\.\d+)/;
  const match = str.match(coordsRegex);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return { lat, lng };
    }
  }

  return null;
};

export const MapLocationPickerModal: React.FC<MapLocationPickerModalProps> = ({
  isOpen,
  onClose,
  initialCoords,
  initialAddress = '',
  onSelectCoords,
}) => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>(
    initialCoords || DEFAULT_LIMA
  );
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (initialCoords) {
      setPosition(initialCoords);
    }
  }, [initialCoords]);

  if (!isOpen) return null;

  // Handle Search / Paste Coordinates or Address
  const handleSearchOrPaste = (textToParse?: string) => {
    const query = (textToParse !== undefined ? textToParse : searchQuery).trim();
    if (!query) {
      setStatusMessage({ text: 'Escriba o pegue coordenadas (ej: -12.0894, -77.0335) o el nombre de un lugar.', isError: true });
      return;
    }

    // 1. Check if string contains coordinates or Google Maps link
    const parsedCoords = parseCoordinatesFromText(query);
    if (parsedCoords) {
      setPosition(parsedCoords);
      setStatusMessage({ text: `📍 Coordenadas detectadas e ir a: ${parsedCoords.lat.toFixed(6)}, ${parsedCoords.lng.toFixed(6)}` });
      setGeoError(null);
      return;
    }

    // 2. Check offline Peru location dictionary
    const normalizedKey = query.toLowerCase().trim();
    const foundDict = PERU_LOCATIONS_DICT[normalizedKey];
    if (foundDict) {
      setPosition({ lat: foundDict.lat, lng: foundDict.lng });
      setStatusMessage({ text: `🏢 Ubicación encontrada: ${foundDict.name} (${foundDict.lat.toFixed(4)}, ${foundDict.lng.toFixed(4)})` });
      setGeoError(null);
      return;
    }

    // Partial search in dictionary
    const partialMatch = Object.keys(PERU_LOCATIONS_DICT).find((k) => normalizedKey.includes(k) || k.includes(normalizedKey));
    if (partialMatch) {
      const dict = PERU_LOCATIONS_DICT[partialMatch];
      setPosition({ lat: dict.lat, lng: dict.lng });
      setStatusMessage({ text: `📍 Ubicación aproximada: ${dict.name} (${dict.lat.toFixed(4)}, ${dict.lng.toFixed(4)})` });
      setGeoError(null);
      return;
    }

    setStatusMessage({
      text: 'No se reconocieron coordenadas en el texto. Puede pegar directamente latitud y longitud separadas por coma, ejemplo: -12.0894, -77.0335',
      isError: true,
    });
  };

  const handleDetectGPS = () => {
    setIsGeolocating(true);
    setGeoError(null);
    setStatusMessage(null);

    if (!navigator.geolocation) {
      setGeoError('Su navegador no soporta geolocalización GPS.');
      setIsGeolocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(newCoords);
        setStatusMessage({ text: `🎯 GPS detectado con éxito: ${newCoords.lat.toFixed(6)}, ${newCoords.lng.toFixed(6)}` });
        setIsGeolocating(false);
      },
      (err) => {
        console.error('Error GPS:', err);
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? 'Permiso de ubicación denegado. Active los permisos en su navegador.'
            : 'No se pudo obtener la señal GPS actual.'
        );
        setIsGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSearchQuery(text);
        handleSearchOrPaste(text);
      }
    } catch {
      setStatusMessage({ text: 'Pegue manualmente en la casilla de búsqueda arriba.', isError: true });
    }
  };

  const handleConfirm = () => {
    onSelectCoords(position, searchQuery);
    onClose();
  };

  // Preset location shortcuts for Peru
  const peruPresets = [
    { name: 'Lima Centro', coords: { lat: -12.046374, lng: -77.042793 } },
    { name: 'Surco (Tienda)', coords: { lat: -12.128, lng: -76.985 } },
    { name: 'Miraflores', coords: { lat: -12.1211, lng: -77.0305 } },
    { name: 'San Isidro', coords: { lat: -12.0975, lng: -77.0363 } },
    { name: 'Lince', coords: { lat: -12.0894, lng: -77.0335 } },
    { name: 'San Borja', coords: { lat: -12.0872, lng: -77.0003 } },
    { name: 'La Molina', coords: { lat: -12.0805, lng: -76.9465 } },
    { name: 'Cusco', coords: { lat: -13.5319, lng: -71.9675 } },
    { name: 'Arequipa', coords: { lat: -16.409, lng: -71.5375 } },
    { name: 'Trujillo', coords: { lat: -8.1116, lng: -79.0286 } },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#161716] text-[#E4DFD7] p-3.5 flex items-center justify-between border-b border-[#61564A]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#61564A] flex items-center justify-center text-[#E4DFD7]">
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wide">
                BÚSQUEDA Y DETECCIÓN DE COORDENADAS MAPS
              </h3>
              <p className="text-[10px] text-[#A59B8F]">
                Pegue coordenadas (ej: -12.0894, -77.0335), enlace de Google Maps o use GPS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#A59B8F] hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH / PASTE COORDENADAS BAR */}
        <div className="p-3 bg-slate-900 text-[#E4DFD7] border-b border-slate-800 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchOrPaste();
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // Auto parse on paste or type if coords detected
                  const parsed = parseCoordinatesFromText(e.target.value);
                  if (parsed) {
                    setPosition(parsed);
                    setStatusMessage({ text: `📍 Coordenadas autodetectadas: ${parsed.lat.toFixed(6)}, ${parsed.lng.toFixed(6)}` });
                  }
                }}
                placeholder="Pegar coordenadas (ej: -12.0894, -77.0335) o link de Google Maps..."
                className="w-full bg-[#161716] border border-[#61564A] text-[#E4DFD7] rounded-xl pl-9 pr-24 py-2 text-xs font-mono font-bold focus:outline-none focus:border-amber-400 placeholder-[#A59B8F]/60"
              />

              <button
                type="button"
                onClick={handlePasteClipboard}
                className="absolute right-2 top-1.5 bg-[#24211E] hover:bg-[#61564A] text-amber-300 font-bold text-[10px] px-2 py-1 rounded-lg border border-[#61564A] transition-all flex items-center space-x-1 cursor-pointer"
                title="Pegar del portapapeles"
              >
                <ClipboardPaste className="w-3 h-3" />
                <span>Pegar</span>
              </button>
            </div>

            <button
              type="submit"
              className="bg-[#61564A] hover:bg-amber-500 hover:text-slate-950 text-[#E4DFD7] font-black text-xs px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0 border border-[#A59B8F] flex items-center space-x-1 shadow-md"
            >
              <Search className="w-3.5 h-3.5" />
              <span>IR A LUGAR</span>
            </button>
          </form>

          {/* GPS Detector Button & Status Messages */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isGeolocating}
              className="bg-[#24211E] hover:bg-[#61564A] text-[#E4DFD7] font-extrabold text-[11px] px-3 py-1 rounded-lg transition-all flex items-center space-x-1.5 border border-[#61564A] active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 text-amber-400 ${isGeolocating ? 'animate-spin' : ''}`} />
              <span>{isGeolocating ? 'Obteniendo GPS...' : '📍 Detectar Mi Ubicación GPS Actual'}</span>
            </button>

            <a
              href={`https://www.google.com/maps?q=${position.lat},${position.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 underline"
            >
              <span>Abrir Mapa Externo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {statusMessage && (
            <div
              className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-2 border transition-all ${
                statusMessage.isError
                  ? 'bg-red-950/80 text-red-200 border-red-800'
                  : 'bg-emerald-950/80 text-emerald-200 border-emerald-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {geoError && (
            <div className="bg-red-950/80 text-red-200 text-xs p-2 rounded-lg border border-red-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{geoError}</span>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 text-[10px]">
            <span className="font-bold text-[#A59B8F] uppercase whitespace-nowrap mr-1">Zonas Frecuentes:</span>
            {peruPresets.map((pr) => (
              <button
                key={pr.name}
                type="button"
                onClick={() => {
                  setPosition(pr.coords);
                  setSearchQuery(pr.name);
                  setStatusMessage({ text: `📍 Centrado en ${pr.name}` });
                }}
                className="bg-[#24211E] hover:bg-[#61564A] text-[#E4DFD7] font-medium px-2 py-0.5 rounded border border-[#61564A] cursor-pointer whitespace-nowrap transition-colors"
              >
                {pr.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Map Display Container */}
        <div className="relative flex-1 min-h-[280px] bg-slate-900">
          {hasValidKey ? (
            <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                center={position}
                zoom={15}
                mapId="DEMO_MAP_ID"
                onClick={(e) => {
                  if (e.detail?.latLng) {
                    const clickedCoords = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng };
                    setPosition(clickedCoords);
                    setStatusMessage({ text: `📍 Pin colocado en: ${clickedCoords.lat.toFixed(6)}, ${clickedCoords.lng.toFixed(6)}` });
                  }
                }}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '320px' }}
              >
                <AdvancedMarker position={position}>
                  <Pin background="#61564A" glyphColor="#fff" borderColor="#161716" />
                </AdvancedMarker>
              </Map>
            </APIProvider>
          ) : (
            <div className="w-full h-[320px] bg-slate-950 text-slate-200 p-4 flex flex-col justify-center items-center text-center space-y-3 relative overflow-hidden">
              {/* Radar Grid Animation */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
              
              <div className="z-10 bg-slate-900/90 border border-slate-700 p-4 rounded-xl max-w-md space-y-2 text-xs shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 text-amber-400 font-bold">
                  <Compass className="w-5 h-5 animate-pulse" />
                  <span className="uppercase tracking-wider">Lugar & Coordenadas GPS Capturadas</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-center space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Ubicación Actual:</div>
                  <div className="text-amber-300 font-extrabold text-sm">
                    {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800 text-left">
                  💡 <strong>Google Maps Satelital:</strong> Para ver imágenes de satélite y calles en vivo, configure su clave en Ajustes ⚙️ → Secrets → <code className="text-amber-300">GOOGLE_MAPS_PLATFORM_KEY</code>.
                </div>
              </div>
            </div>
          )}

          {/* Floating Coords Action Overlay */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-[#161716]/95 backdrop-blur-md text-[#E4DFD7] p-2.5 rounded-xl border border-[#61564A] text-xs font-mono shadow-2xl flex items-center justify-between gap-3 z-10">
            <div>
              <span className="text-[9px] text-[#A59B8F] uppercase block font-sans font-bold">Coordenadas a Guardar:</span>
              <span className="font-extrabold text-amber-300 text-xs">
                {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center space-x-1 cursor-pointer active:scale-95 shrink-0 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Usar Estas Coordenadas</span>
            </button>
          </div>
        </div>

        {/* Manual Precision Editing */}
        <div className="p-3 bg-white border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[9px] font-bold text-slate-600 uppercase block mb-0.5">Latitud</label>
            <input
              type="number"
              step="any"
              value={position.lat}
              onChange={(e) => {
                const lat = parseFloat(e.target.value) || 0;
                setPosition((prev) => ({ ...prev, lat }));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-mono text-slate-800 text-xs focus:border-[#61564A]"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-slate-600 uppercase block mb-0.5">Longitud</label>
            <input
              type="number"
              step="any"
              value={position.lng}
              onChange={(e) => {
                const lng = parseFloat(e.target.value) || 0;
                setPosition((prev) => ({ ...prev, lng }));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-mono text-slate-800 text-xs focus:border-[#61564A]"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-[#161716] hover:bg-[#61564A] text-[#E4DFD7] font-extrabold text-xs px-5 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
          >
            <Check className="w-4 h-4 text-amber-400" />
            <span>Confirmar Ubicación</span>
          </button>
        </div>

      </div>
    </div>
  );
};

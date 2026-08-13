import { Product, Province, District, Zone, Order, EmailLog, StockMovement } from '../types';

export const INITIAL_PROVINCES: Province[] = [
  { id: 'prov-lim', name: 'Lima', code: 'LIM' },
  { id: 'prov-aqp', name: 'Arequipa', code: 'AQP' },
  { id: 'prov-lal', name: 'La Libertad (Trujillo)', code: 'LAL' },
  { id: 'prov-cus', name: 'Cusco', code: 'CUS' },
  { id: 'prov-piu', name: 'Piura', code: 'PIU' },
];

export const INITIAL_ZONES: Zone[] = [
  {
    id: 'zone-lim-centro',
    name: 'Lima Centro Express',
    provinceId: 'prov-lim',
    shippingFee: 10.00,
    estimatedDays: 'Mismo Día / 24 hrs',
    courierAssigned: 'Motorizados Express Urbano (Carlos Ruiz)',
    status: 'active'
  },
  {
    id: 'zone-lim-moderna',
    name: 'Lima Moderna & Residencial',
    provinceId: 'prov-lim',
    shippingFee: 12.50,
    estimatedDays: '24 - 48 hrs',
    courierAssigned: 'Flota Rapida SAC (Jorge Mendoza)',
    status: 'active'
  },
  {
    id: 'zone-lim-periferia',
    name: 'Lima Norte / Sur Expreso',
    provinceId: 'prov-lim',
    shippingFee: 18.00,
    estimatedDays: '24 - 48 hrs',
    courierAssigned: 'Cargo Express Peru',
    status: 'active'
  },
  {
    id: 'zone-aqp-urbano',
    name: 'Arequipa Metropolitana',
    provinceId: 'prov-aqp',
    shippingFee: 22.00,
    estimatedDays: '2 - 3 días hábiles',
    courierAssigned: 'Arequipa Cargo Express',
    status: 'active'
  },
  {
    id: 'zone-lal-trujillo',
    name: 'Trujillo Metropolitano',
    provinceId: 'prov-lal',
    shippingFee: 20.00,
    estimatedDays: '2 - 3 días hábiles',
    courierAssigned: 'Servicios Logísticos del Norte',
    status: 'active'
  },
  {
    id: 'zone-cus-imperial',
    name: 'Cusco Valle & Ciudad',
    provinceId: 'prov-cus',
    shippingFee: 28.00,
    estimatedDays: '3 - 4 días hábiles',
    courierAssigned: 'Andes Express Cargo',
    status: 'active'
  }
];

export const INITIAL_DISTRICTS: District[] = [
  // Lima
  { id: 'dist-miraflores', provinceId: 'prov-lim', name: 'Miraflores', zoneId: 'zone-lim-moderna' },
  { id: 'dist-san-isidro', provinceId: 'prov-lim', name: 'San Isidro', zoneId: 'zone-lim-moderna' },
  { id: 'dist-surco', provinceId: 'prov-lim', name: 'Santiago de Surco', zoneId: 'zone-lim-moderna' },
  { id: 'dist-san-borja', provinceId: 'prov-lim', name: 'San Borja', zoneId: 'zone-lim-moderna' },
  { id: 'dist-lima-cercado', provinceId: 'prov-lim', name: 'Cercado de Lima', zoneId: 'zone-lim-centro' },
  { id: 'dist-breña', provinceId: 'prov-lim', name: 'Breña', zoneId: 'zone-lim-centro' },
  { id: 'dist-los-olivos', provinceId: 'prov-lim', name: 'Los Olivos', zoneId: 'zone-lim-periferia' },
  { id: 'dist-san-juan-miraflores', provinceId: 'prov-lim', name: 'San Juan de Miraflores', zoneId: 'zone-lim-periferia' },

  // Arequipa
  { id: 'dist-cayma', provinceId: 'prov-aqp', name: 'Cayma', zoneId: 'zone-aqp-urbano' },
  { id: 'dist-yanahuara', provinceId: 'prov-aqp', name: 'Yanahuara', zoneId: 'zone-aqp-urbano' },
  { id: 'dist-aqp-cercado', provinceId: 'prov-aqp', name: 'Arequipa Cercado', zoneId: 'zone-aqp-urbano' },

  // Trujillo
  { id: 'dist-trujillo-cercado', provinceId: 'prov-lal', name: 'Trujillo Cercado', zoneId: 'zone-lal-trujillo' },
  { id: 'dist-victor-larco', provinceId: 'prov-lal', name: 'Víctor Larco Herrera', zoneId: 'zone-lal-trujillo' },

  // Cusco
  { id: 'dist-wanchaq', provinceId: 'prov-cus', name: 'Wanchaq', zoneId: 'zone-cus-imperial' },
  { id: 'dist-san-sebastian', provinceId: 'prov-cus', name: 'San Sebastián', zoneId: 'zone-cus-imperial' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. ARETES (17 productos)
  {
    id: 'prod-art-001',
    sku: 'OBS-ART-01',
    name: 'Aretes Esfera',
    category: 'Aretes',
    price: 49.00,
    stock: 15,
    minStock: 5,
    location: 'Exhibidor Aretes - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-art-002',
    sku: 'OBS-ART-02',
    name: 'Aretes Conchita',
    category: 'Aretes',
    price: 59.00,
    stock: 12,
    minStock: 4,
    location: 'Exhibidor Aretes - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-art-003',
    sku: 'OBS-ART-03',
    name: 'Aretes Corazón Liso',
    category: 'Aretes',
    price: 39.00,
    stock: 20,
    minStock: 5,
    location: 'Exhibidor Aretes - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod-art-004',
    sku: 'OBS-ART-04',
    name: 'Aretes Flor Rosa',
    category: 'Aretes',
    price: 39.00,
    stock: 18,
    minStock: 5,
    location: 'Exhibidor Aretes - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-art-005',
    sku: 'OBS-ART-05',
    name: 'Aretes Corazón Rosa (Plata P50)',
    category: 'Aretes',
    price: 49.00,
    stock: 10,
    minStock: 3,
    location: 'Exhibidor Aretes - Plata P50',
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'prod-art-006',
    sku: 'OBS-ART-06',
    name: 'Aretes Corazón Circón',
    category: 'Aretes',
    price: 49.00,
    stock: 14,
    minStock: 4,
    location: 'Exhibidor Aretes - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-art-007',
    sku: 'OBS-ART-07',
    name: 'Aretes Corazón Perla',
    category: 'Aretes',
    price: 49.00,
    stock: 8,
    minStock: 3,
    location: 'Exhibidor Aretes - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'prod-art-008',
    sku: 'OBS-ART-08',
    name: 'Aretes Flor Perla',
    category: 'Aretes',
    price: 49.00,
    stock: 16,
    minStock: 4,
    location: 'Exhibidor Aretes - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-art-009',
    sku: 'OBS-ART-09',
    name: 'Aretes Estrella de Mar',
    category: 'Aretes',
    price: 59.00,
    stock: 12,
    minStock: 4,
    location: 'Exhibidor Aretes - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-art-010',
    sku: 'OBS-ART-10',
    name: 'Aretes Pastilla',
    category: 'Aretes',
    price: 49.00,
    stock: 15,
    minStock: 5,
    location: 'Exhibidor Aretes - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod-art-011',
    sku: 'OBS-ART-11',
    name: 'Aretes Triqueta',
    category: 'Aretes',
    price: 59.00,
    stock: 9,
    minStock: 3,
    location: 'Exhibidor Aretes - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-art-012',
    sku: 'OBS-ART-12',
    name: 'Aretes Brillantes',
    category: 'Aretes',
    price: 49.00,
    stock: 11,
    minStock: 4,
    location: 'Exhibidor Aretes - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'prod-art-013',
    sku: 'OBS-ART-13',
    name: 'Aretes Huella',
    category: 'Aretes',
    price: 59.00,
    stock: 10,
    minStock: 3,
    location: 'Exhibidor Aretes - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-art-014',
    sku: 'OBS-ART-14',
    name: 'Aretes Búho',
    category: 'Aretes',
    price: 59.00,
    stock: 7,
    minStock: 3,
    location: 'Exhibidor Aretes - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'prod-art-015',
    sku: 'OBS-ART-15',
    name: 'Argolla Entrochada',
    category: 'Aretes',
    price: 69.00,
    stock: 14,
    minStock: 5,
    location: 'Exhibidor Aretes - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-art-016',
    sku: 'OBS-ART-16',
    name: 'Argolla Lisa',
    category: 'Aretes',
    price: 69.00,
    stock: 18,
    minStock: 5,
    location: 'Exhibidor Aretes - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-art-017',
    sku: 'OBS-ART-17',
    name: 'Aretes Rombos',
    category: 'Aretes',
    price: 59.00,
    stock: 0,
    minStock: 4,
    location: 'Exhibidor Aretes - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString()
  },

  // 2. CONJUNTOS (4 productos)
  {
    id: 'prod-cnj-001',
    sku: 'OBS-CNJ-01',
    name: 'Conjunto Aros (Aretes + Cadena Cola de Ratón 45cm)',
    category: 'Conjuntos',
    price: 89.00,
    stock: 8,
    minStock: 3,
    location: 'Exhibidor Conjuntos - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-cnj-002',
    sku: 'OBS-CNJ-02',
    name: 'Conjunto Perla Circón (Aretes + Dije + Cadena 45cm)',
    category: 'Conjuntos',
    price: 89.00,
    stock: 10,
    minStock: 3,
    location: 'Exhibidor Conjuntos - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-cnj-003',
    sku: 'OBS-CNJ-03',
    name: 'Conjunto Corazón Verde (Aretes + Cadena Cola de Ratón 45cm)',
    category: 'Conjuntos',
    price: 99.00,
    stock: 6,
    minStock: 2,
    location: 'Exhibidor Conjuntos - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod-cnj-004',
    sku: 'OBS-CNJ-04',
    name: 'Conjunto Mandala (Aretes + Cadena Cola de Ratón 45cm)',
    category: 'Conjuntos',
    price: 89.00,
    stock: 9,
    minStock: 3,
    location: 'Exhibidor Conjuntos - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },

  // 3. COLLARES (15 productos)
  {
    id: 'prod-col-001',
    sku: 'OBS-COL-01',
    name: 'Collar Nudo de Bruja (Dije Plata 950 + Cadena Soga 45cm)',
    category: 'Collares',
    price: 89.00,
    stock: 12,
    minStock: 4,
    location: 'Exhibidor Collares - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-col-002',
    sku: 'OBS-COL-02',
    name: 'Collar Flor de Loto (Dije Plata 950 + Cadena Pancer 45cm)',
    category: 'Collares',
    price: 89.00,
    stock: 15,
    minStock: 5,
    location: 'Exhibidor Collares - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-col-003',
    sku: 'OBS-COL-03',
    name: 'Collar Girasol (Dije Plata 950 + Cadena Pancer 45cm)',
    category: 'Collares',
    price: 89.00,
    stock: 11,
    minStock: 4,
    location: 'Exhibidor Collares - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod-col-004',
    sku: 'OBS-COL-04',
    name: 'Collar Flor Andina (Dije Plata 950 + Cadena Pancer 45cm)',
    category: 'Collares',
    price: 89.00,
    stock: 10,
    minStock: 3,
    location: 'Exhibidor Collares - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-col-005',
    sku: 'OBS-COL-05',
    name: 'Collar Corazón Amazonita (Dije Plata 950 Piedra Natural)',
    category: 'Collares',
    price: 89.00,
    stock: 8,
    minStock: 3,
    location: 'Exhibidor Collares - Piedras Naturales',
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'prod-col-006',
    sku: 'OBS-COL-06',
    name: 'Collar Obsidiana (Dije Plata 950 Piedra Natural + Cadena)',
    category: 'Collares',
    price: 89.00,
    stock: 20,
    minStock: 5,
    location: 'Exhibidor Collares - Piedras Naturales',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-col-007',
    sku: 'OBS-COL-07',
    name: 'Collar Amatista (Dije Plata 950 Piedra Natural + Cadena)',
    category: 'Collares',
    price: 89.00,
    stock: 9,
    minStock: 3,
    location: 'Exhibidor Collares - Piedras Naturales',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-col-008',
    sku: 'OBS-COL-08',
    name: 'Collar Flor Cosmos (Dije Plata 950 + Cadena Pancer 45cm)',
    category: 'Collares',
    price: 89.00,
    stock: 14,
    minStock: 4,
    location: 'Exhibidor Collares - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod-col-009',
    sku: 'OBS-COL-09',
    name: 'Collar Trébol (Dije Plata 925 + Cadena Pancer 45cm)',
    category: 'Collares',
    price: 89.00,
    stock: 13,
    minStock: 4,
    location: 'Exhibidor Collares - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-col-010',
    sku: 'OBS-COL-10',
    name: 'Collar Corazón Diamantado (Dije Plata 925 + Cadena)',
    category: 'Collares',
    price: 79.00,
    stock: 16,
    minStock: 5,
    location: 'Exhibidor Collares - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-col-011',
    sku: 'OBS-COL-11',
    name: 'Collar Estrella de Mar (Dije Plata 950 + Cadena Pancer)',
    category: 'Collares',
    price: 79.00,
    stock: 12,
    minStock: 4,
    location: 'Exhibidor Collares - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod-col-012',
    sku: 'OBS-COL-12',
    name: 'Collar Estrella Lisa (Dije Plata 950 + Cadena Cola de Ratón)',
    category: 'Collares',
    price: 79.00,
    stock: 10,
    minStock: 3,
    location: 'Exhibidor Collares - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-col-013',
    sku: 'OBS-COL-13',
    name: 'Collar Cruz Andina (Dije Plata 925 + Cadena Pancer 45cm)',
    category: 'Collares',
    price: 79.00,
    stock: 15,
    minStock: 5,
    location: 'Exhibidor Collares - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-col-014',
    sku: 'OBS-COL-14',
    name: 'Collar Hoja Arce (Dije Plata 925 + Cadena Pancer 45cm)',
    category: 'Collares',
    price: 79.00,
    stock: 7,
    minStock: 3,
    location: 'Exhibidor Collares - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'prod-col-015',
    sku: 'OBS-COL-15',
    name: 'Collar Satelital (Plata 950, 45 cm)',
    category: 'Collares',
    price: 65.00,
    stock: 18,
    minStock: 5,
    location: 'Exhibidor Collares - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },

  // 4. PULSERAS (6 productos)
  {
    id: 'prod-pul-001',
    sku: 'OBS-PUL-01',
    name: 'Pulsera Corazón Rojo (Plata 925, Regulable)',
    category: 'Pulseras',
    price: 59.00,
    stock: 12,
    minStock: 4,
    location: 'Exhibidor Pulseras - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-pul-002',
    sku: 'OBS-PUL-02',
    name: 'Pulsera Trébol Brillante (Plata 925, Regulable)',
    category: 'Pulseras',
    price: 59.00,
    stock: 14,
    minStock: 4,
    location: 'Exhibidor Pulseras - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-pul-003',
    sku: 'OBS-PUL-03',
    name: 'Pulsera Tres Lazos (Plata 925, Regulable)',
    category: 'Pulseras',
    price: 55.00,
    stock: 10,
    minStock: 3,
    location: 'Exhibidor Pulseras - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod-pul-004',
    sku: 'OBS-PUL-04',
    name: 'Pulsera Doble Corazones (Plata 925, Regulable)',
    category: 'Pulseras',
    price: 55.00,
    stock: 9,
    minStock: 3,
    location: 'Exhibidor Pulseras - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-pul-005',
    sku: 'OBS-PUL-05',
    name: 'Pulsera Eslabones Finos (Gucci, Entorchada y Pancer Plata 950)',
    category: 'Pulseras',
    price: 49.00,
    stock: 15,
    minStock: 5,
    location: 'Exhibidor Pulseras - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-pul-006',
    sku: 'OBS-PUL-06',
    name: 'Pulsera Eclipse (Plata 925)',
    category: 'Pulseras',
    price: 55.00,
    stock: 8,
    minStock: 3,
    location: 'Exhibidor Pulseras - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },

  // 5. ANILLOS (5 productos)
  {
    id: 'prod-anl-001',
    sku: 'OBS-ANL-01',
    name: 'Anillo Margarita (Plata 950)',
    category: 'Anillos',
    price: 49.00,
    stock: 11,
    minStock: 4,
    location: 'Exhibidor Anillos - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-anl-002',
    sku: 'OBS-ANL-02',
    name: 'Anillo Eslabones (Plata 925)',
    category: 'Anillos',
    price: 39.00,
    stock: 14,
    minStock: 4,
    location: 'Exhibidor Anillos - Plata 925',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'prod-anl-003',
    sku: 'OBS-ANL-03',
    name: 'Anillo Órbita (Plata 950)',
    category: 'Anillos',
    price: 39.00,
    stock: 12,
    minStock: 4,
    location: 'Exhibidor Anillos - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'prod-anl-004',
    sku: 'OBS-ANL-04',
    name: 'Anillo Infinito (Plata 950)',
    category: 'Anillos',
    price: 39.00,
    stock: 16,
    minStock: 5,
    location: 'Exhibidor Anillos - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'prod-anl-005',
    sku: 'OBS-ANL-05',
    name: 'Anillo Corazón Circón (Plata 950 - Variantes Color)',
    category: 'Anillos',
    price: 39.00,
    stock: 20,
    minStock: 6,
    location: 'Exhibidor Anillos - Plata 950',
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'PED-2026-0091',
    trackingCode: 'TRK-98412',
    customer: {
      name: 'Camila Alarcón Sotomayor',
      email: 'camila.alarcon@gmail.com',
      phone: '+51 987 654 321',
      address: 'Av. Larco 742, Depto 502',
      province: 'Lima',
      district: 'Miraflores',
      zone: 'Lima Moderna & Residencial',
      notes: 'Llamar al llegar, dejar con el conserje si no responde'
    },
    items: [
      {
        productId: 'prod-col-006',
        productName: 'Collar Obsidiana (Dije Plata 950 Piedra Natural + Cadena)',
        sku: 'OBS-COL-06',
        quantity: 1,
        unitPrice: 89.00,
        total: 89.00
      },
      {
        productId: 'prod-cnj-001',
        productName: 'Conjunto Aros (Aretes + Cadena Cola de Ratón 45cm)',
        sku: 'OBS-CNJ-01',
        quantity: 1,
        unitPrice: 89.00,
        total: 89.00
      }
    ],
    subtotal: 178.00,
    shippingFee: 12.50,
    total: 190.50,
    status: 'en_ruta',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    estimatedDelivery: 'Hoy antes de las 6:00 PM',
    paymentMethod: 'Transferencia BCP / Yape',
    courier: {
      driverName: 'Jorge Mendoza Paredes',
      driverPhone: '+51 912 345 678',
      vehicle: 'Motorizado Obsidiana Express',
      licensePlate: 'MC-7890'
    },
    timeline: [
      {
        id: 'step-1',
        status: 'pendiente',
        title: 'Pedido Registrado',
        description: 'Pedido ingresado en el sistema Obsidiana Joyería',
        location: 'Taller Central Obsidiana Lima',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        completed: true
      },
      {
        id: 'step-2',
        status: 'en_preparacion',
        title: 'Empaquetado de Joyas en Caja de Regalo',
        description: 'Joyas empacadas en estuche aterciopelado con certificado de autenticidad Plata 950',
        location: 'Almacén Obsidiana Miraflores',
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        completed: true
      },
      {
        id: 'step-3',
        status: 'en_ruta',
        title: 'En Camino a Dirección de Entrega',
        description: 'Asignado a repartidor Jorge Mendoza - En ruta a Miraflores',
        location: 'En Ruta - Lima Moderna',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        completed: true
      },
      {
        id: 'step-4',
        status: 'entregado',
        title: 'Entrega Completada',
        description: 'Recepción firmada por el cliente',
        location: 'Av. Larco 742, Miraflores',
        timestamp: '',
        completed: false
      }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'PED-2026-0092',
    trackingCode: 'TRK-88104',
    customer: {
      name: 'Gonzalo Benavides Vega',
      email: 'gonzalo.benavides@empresa.pe',
      phone: '+51 955 123 987',
      address: 'Calle Valle Riestra 320',
      province: 'Arequipa',
      district: 'Cayma',
      zone: 'Arequipa Metropolitana',
      notes: 'Empaque de regalo especial de aniversario'
    },
    items: [
      {
        productId: 'prod-cnj-003',
        productName: 'Conjunto Corazón Verde (Aretes + Cadena Cola de Ratón 45cm)',
        sku: 'OBS-CNJ-03',
        quantity: 1,
        unitPrice: 99.00,
        total: 99.00
      },
      {
        productId: 'prod-art-015',
        productName: 'Argolla Entrochada (Plata 950)',
        sku: 'OBS-ART-15',
        quantity: 1,
        unitPrice: 69.00,
        total: 69.00
      }
    ],
    subtotal: 168.00,
    shippingFee: 22.00,
    total: 190.00,
    status: 'en_preparacion',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    estimatedDelivery: '31 de Julio (En 2 días)',
    paymentMethod: 'Tarjeta de Crédito Visa',
    courier: {
      driverName: 'Arequipa Cargo Express',
      driverPhone: '',
      vehicle: 'Camión Interprovincial R3',
      licensePlate: 'V4B-910'
    },
    timeline: [
      {
        id: 'step-1',
        status: 'pendiente',
        title: 'Pedido Registrado',
        description: 'Pago recibido correctamente con Tarjeta Visa',
        location: 'Sistema Central Obsidiana',
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        completed: true
      },
      {
        id: 'step-2',
        status: 'en_preparacion',
        title: 'Inspección de Calidad de Joyas',
        description: 'Verificando acabados de Plata 925 y grabado para envío a provincia',
        location: 'Taller de Joyería Obsidiana',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        completed: true
      },
      {
        id: 'step-3',
        status: 'en_ruta',
        title: 'Despacho Interprovincial',
        description: 'Enviado a courier Arequipa Cargo',
        location: 'Agencia Cargo Lima - Arequipa',
        timestamp: '',
        completed: false
      },
      {
        id: 'step-4',
        status: 'entregado',
        title: 'Entrega en Cayma, Arequipa',
        description: 'Entrega final',
        location: 'Cayma, Arequipa',
        timestamp: '',
        completed: false
      }
    ]
  },
  {
    id: 'ord-1003',
    orderNumber: 'PED-2026-0090',
    trackingCode: 'TRK-77192',
    customer: {
      name: 'Lucía Morales Prado',
      email: 'lucia.morales@hotmail.com',
      phone: '+51 941 882 110',
      address: 'Jr. Carabaya 450, Of. 301',
      province: 'Lima',
      district: 'Cercado de Lima',
      zone: 'Lima Centro Express',
      notes: ''
    },
    items: [
      {
        productId: 'prod-col-001',
        productName: 'Collar Nudo de Bruja (Dije Plata 950 + Cadena Soga 45cm)',
        sku: 'OBS-COL-01',
        quantity: 1,
        unitPrice: 89.00,
        total: 89.00
      },
      {
        productId: 'prod-pul-001',
        productName: 'Pulsera Corazón Rojo (Plata 925, Regulable)',
        sku: 'OBS-PUL-01',
        quantity: 1,
        unitPrice: 59.00,
        total: 59.00
      }
    ],
    subtotal: 148.00,
    shippingFee: 10.00,
    total: 158.00,
    status: 'entregado',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    estimatedDelivery: 'Completado',
    paymentMethod: 'Pago Contraentrega (Yape)',
    courier: {
      driverName: 'Carlos Ruiz Alva',
      driverPhone: '+51 977 112 334',
      vehicle: 'Motorizado Obsidiana Express',
      licensePlate: 'MC-4512'
    },
    timeline: [
      {
        id: 'step-1',
        status: 'pendiente',
        title: 'Pedido Registrado',
        description: 'Pedido tomado para entrega en Lima Centro',
        location: 'Obsidiana Central',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        completed: true
      },
      {
        id: 'step-2',
        status: 'en_preparacion',
        title: 'Preparado y Empacado',
        description: 'Listo para despacho motorizado',
        location: 'Almacén Obsidiana',
        timestamp: new Date(Date.now() - 86400000 * 1.8).toISOString(),
        completed: true
      },
      {
        id: 'step-3',
        status: 'en_ruta',
        title: 'Motorizado en Camino',
        description: 'Motorizado Carlos Ruiz en ruta',
        location: 'En Ruta Centro de Lima',
        timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString(),
        completed: true
      },
      {
        id: 'step-4',
        status: 'entregado',
        title: 'Entregado Satisfactoriamente',
        description: 'Entregado a Lucía Morales. Pago verificado por Yape.',
        location: 'Jr. Carabaya 450, Of. 301, Cercado de Lima',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        completed: true
      }
    ]
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-01',
    productId: 'prod-001',
    productName: 'Laptop Executive Pro 15.6" i7 16GB',
    type: 'out',
    quantity: 1,
    reason: 'Venta realizada - Pedido PED-2026-0091',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    performedBy: 'Sistema Automático'
  },
  {
    id: 'mov-02',
    productId: 'prod-003',
    productName: 'Silla Ergonómica Mesh Lumbar Ajustable',
    type: 'out',
    quantity: 2,
    reason: 'Venta realizada - Pedido PED-2026-0092',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    performedBy: 'Sistema Automático'
  },
  {
    id: 'mov-03',
    productId: 'prod-002',
    productName: 'Audífonos Bluetooth Noise Cancelling Studio',
    type: 'in',
    quantity: 20,
    reason: 'Reabastecimiento de Proveedor Importaciones SAC',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    performedBy: 'Jefe de Almacén (Marcos Silva)'
  }
];

export const INITIAL_EMAIL_LOGS: EmailLog[] = [
  {
    id: 'email-1',
    orderId: 'ord-1001',
    trackingCode: 'TRK-98412',
    recipientEmail: 'camila.alarcon@gmail.com',
    recipientName: 'Camila Alarcón Sotomayor',
    subject: '¡Tu pedido PED-2026-0091 ya está en camino! 🚚',
    templateType: 'order_dispatched',
    sentAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'sent',
    bodyHtml: `<div style="font-family: sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc;">
      <h2 style="color: #2563eb;">¡Hola Camila! Tu pedido está en ruta</h2>
      <p>Nos alegra informarte que tu pedido <strong>PED-2026-0091</strong> con código de seguimiento <strong>TRK-98412</strong> ha sido despachado y se encuentra en camino a Miraflores.</p>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Repartidor asignado:</strong> Jorge Mendoza Paredes (+51 912 345 678)</p>
        <p style="margin: 0 0 8px 0;"><strong>Dirección:</strong> Av. Larco 742, Depto 502, Miraflores, Lima</p>
        <p style="margin: 0;"><strong>Tiempo estimado de llegada:</strong> Hoy antes de las 6:00 PM</p>
      </div>
      <p>Puedes rastrear el estado en vivo de tu envío con el código <strong>TRK-98412</strong>.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #64748b;">Sistema de Envíos Logísticos Perú - Mensaje Automático</p>
    </div>`
  },
  {
    id: 'email-2',
    orderId: 'ord-1002',
    trackingCode: 'TRK-88104',
    recipientEmail: 'gonzalo.benavides@empresa.pe',
    recipientName: 'Gonzalo Benavides Vega',
    subject: 'Confirmación de Pedido PED-2026-0092 - En Preparación 📦',
    templateType: 'order_created',
    sentAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'sent',
    bodyHtml: `<div style="font-family: sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc;">
      <h2 style="color: #2563eb;">¡Gracias por tu compra, Gonzalo!</h2>
      <p>Hemos recibido tu pedido <strong>PED-2026-0092</strong> con éxito. Nuestro equipo de almacén se encuentra preparando tus productos para el envío a Arequipa.</p>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Código de Rastreo:</strong> TRK-88104</p>
        <p style="margin: 0 0 8px 0;"><strong>Total Pagado:</strong> S/ 1,522.00</p>
        <p style="margin: 0;"><strong>Destino:</strong> Cayma, Arequipa (Arequipa Metropolitana)</p>
      </div>
      <p>Te enviaremos una notificación por correo cuando tu paquete sea despachado.</p>
    </div>`
  }
];

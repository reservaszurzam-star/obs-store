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
  {
    "id": "prod-are-001",
    "sku": "OBS-ARE-001",
    "name": "Conchita",
    "category": "Aretes",
    "price": 59,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.195Z",
    "imageUrl": "/productos/prod-are-001.jpeg",
    "hoverImageUrl": "/productos/prod-are-001-hover.jpeg"
  },
  {
    "id": "prod-are-002",
    "sku": "OBS-ARE-002",
    "name": "Esfera",
    "category": "Aretes",
    "price": 49,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.204Z",
    "imageUrl": "/productos/prod-are-002.jpeg",
    "hoverImageUrl": "/productos/prod-are-002-hover.jpeg"
  },
  {
    "id": "prod-are-003",
    "sku": "OBS-ARE-003",
    "name": "Corazón Liso",
    "category": "Aretes",
    "price": 39,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.208Z",
    "imageUrl": "/productos/prod-are-003.jpeg",
    "hoverImageUrl": "/productos/prod-are-003-hover.jpeg"
  },
  {
    "id": "prod-are-004",
    "sku": "OBS-ARE-004",
    "name": "Flor Rosa",
    "category": "Aretes",
    "price": 39,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.208Z",
    "imageUrl": "/productos/prod-are-004.jpeg",
    "hoverImageUrl": "/productos/prod-are-004-hover.jpeg"
  },
  {
    "id": "prod-are-005",
    "sku": "OBS-ARE-005",
    "name": "Corazón Rosa",
    "category": "Aretes",
    "price": 49,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.211Z",
    "imageUrl": "/productos/prod-are-005.jpeg",
    "hoverImageUrl": "/productos/prod-are-005-hover.jpeg"
  },
  {
    "id": "prod-are-006",
    "sku": "OBS-ARE-006",
    "name": "Corazón Circón",
    "category": "Aretes",
    "price": 49,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.216Z",
    "imageUrl": "/productos/prod-are-006.jpeg",
    "hoverImageUrl": "/productos/prod-are-006-hover.jpeg"
  },
  {
    "id": "prod-are-007",
    "sku": "OBS-ARE-007",
    "name": "Corazón Perla",
    "category": "Aretes",
    "price": 49,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.220Z",
    "imageUrl": "/productos/prod-are-007.jpeg",
    "hoverImageUrl": "/productos/prod-are-007-hover.jpeg"
  },
  {
    "id": "prod-are-008",
    "sku": "OBS-ARE-008",
    "name": "Flor Perla",
    "category": "Aretes",
    "price": 49,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.223Z",
    "imageUrl": "/productos/prod-are-008.jpeg",
    "hoverImageUrl": "/productos/prod-are-008-hover.jpeg"
  },
  {
    "id": "prod-are-009",
    "sku": "OBS-ARE-009",
    "name": "Estrella de Mar",
    "category": "Aretes",
    "price": 59,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.227Z",
    "imageUrl": "/productos/prod-are-009.jpeg",
    "hoverImageUrl": "/productos/prod-are-009-hover.jpeg"
  },
  {
    "id": "prod-are-010",
    "sku": "OBS-ARE-010",
    "name": "Pastilla",
    "category": "Aretes",
    "price": 49,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.232Z",
    "imageUrl": "/productos/prod-are-010.jpeg",
    "hoverImageUrl": "/productos/prod-are-010-hover.jpeg"
  },
  {
    "id": "prod-are-011",
    "sku": "OBS-ARE-011",
    "name": "Triqueta",
    "category": "Aretes",
    "price": 59,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.236Z",
    "imageUrl": "/productos/prod-are-011.jpeg",
    "hoverImageUrl": "/productos/prod-are-011-hover.jpeg"
  },
  {
    "id": "prod-are-012",
    "sku": "OBS-ARE-012",
    "name": "Brillantes",
    "category": "Aretes",
    "price": 49,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.240Z",
    "imageUrl": "/productos/prod-are-012.jpeg",
    "hoverImageUrl": "/productos/prod-are-012-hover.jpeg"
  },
  {
    "id": "prod-are-013",
    "sku": "OBS-ARE-013",
    "name": "Huella",
    "category": "Aretes",
    "price": 59,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.244Z",
    "imageUrl": "/productos/prod-are-013.jpeg",
    "hoverImageUrl": "/productos/prod-are-013-hover.jpeg"
  },
  {
    "id": "prod-are-014",
    "sku": "OBS-ARE-014",
    "name": "Búho",
    "category": "Aretes",
    "price": 59,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.248Z",
    "imageUrl": "/productos/prod-are-014.jpeg",
    "hoverImageUrl": "/productos/prod-are-014-hover.jpeg"
  },
  {
    "id": "prod-are-015",
    "sku": "OBS-ARE-015",
    "name": "Argolla Entrochada",
    "category": "Aretes",
    "price": 69,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.252Z",
    "imageUrl": "/productos/prod-are-015.jpeg",
    "hoverImageUrl": "/productos/prod-are-015-hover.jpeg"
  },
  {
    "id": "prod-are-016",
    "sku": "OBS-ARE-016",
    "name": "Argolla Lisa",
    "category": "Aretes",
    "price": 69,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.256Z",
    "imageUrl": "/productos/prod-are-016.jpeg",
    "hoverImageUrl": "/productos/prod-are-016-hover.jpeg"
  },
  {
    "id": "prod-are-017",
    "sku": "OBS-ARE-017",
    "name": "Rombos",
    "category": "Aretes",
    "price": 59,
    "stock": 0,
    "minStock": 2,
    "location": "Vitrina Principal - Aretes",
    "updatedAt": "2026-08-16T00:48:45.260Z",
    "imageUrl": "/productos/prod-are-017.jpeg",
    "hoverImageUrl": "/productos/prod-are-017-hover.jpeg"
  },
  {
    "id": "prod-con-018",
    "sku": "OBS-CON-018",
    "name": "Conjunto Aros",
    "category": "Conjuntos",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Conjuntos",
    "updatedAt": "2026-08-16T00:48:45.265Z",
    "imageUrl": "/productos/prod-con-018.jpeg",
    "hoverImageUrl": "/productos/prod-con-018-hover.jpeg"
  },
  {
    "id": "prod-con-019",
    "sku": "OBS-CON-019",
    "name": "Conjunto Perla Circón",
    "category": "Conjuntos",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Conjuntos",
    "updatedAt": "2026-08-16T00:48:45.269Z",
    "imageUrl": "/productos/prod-con-019.jpeg",
    "hoverImageUrl": "/productos/prod-con-019-hover.jpeg"
  },
  {
    "id": "prod-con-020",
    "sku": "OBS-CON-020",
    "name": "Conjunto Corazón Verde",
    "category": "Conjuntos",
    "price": 99,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Conjuntos",
    "updatedAt": "2026-08-16T00:48:45.273Z",
    "imageUrl": "/productos/prod-con-020.jpeg",
    "hoverImageUrl": "/productos/prod-con-020-hover.jpeg"
  },
  {
    "id": "prod-con-021",
    "sku": "OBS-CON-021",
    "name": "Conjunto Mandala",
    "category": "Conjuntos",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Conjuntos",
    "updatedAt": "2026-08-16T00:48:45.277Z",
    "imageUrl": "/productos/prod-con-021.jpeg",
    "hoverImageUrl": "/productos/prod-con-021-hover.jpeg"
  },
  {
    "id": "prod-col-022",
    "sku": "OBS-COL-022",
    "name": "Nudo de Bruja",
    "category": "Anillos",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Anillos",
    "updatedAt": "2026-08-16T00:48:45.282Z",
    "imageUrl": "/productos/prod-col-022.jpeg",
    "hoverImageUrl": "/productos/prod-col-022-hover.jpeg"
  },
  {
    "id": "prod-col-023",
    "sku": "OBS-COL-023",
    "name": "Flor de Loto",
    "category": "Collares",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.287Z",
    "imageUrl": "/productos/prod-col-023.jpeg",
    "hoverImageUrl": "/productos/prod-col-023-hover.jpeg"
  },
  {
    "id": "prod-col-024",
    "sku": "OBS-COL-024",
    "name": "Girasol",
    "category": "Collares",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.292Z",
    "imageUrl": "/productos/prod-col-024.jpeg",
    "hoverImageUrl": "/productos/prod-col-024-hover.jpeg"
  },
  {
    "id": "prod-col-025",
    "sku": "OBS-COL-025",
    "name": "Flor Andina",
    "category": "Collares",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.297Z",
    "imageUrl": "/productos/prod-col-025.jpeg",
    "hoverImageUrl": "/productos/prod-col-025-hover.jpeg"
  },
  {
    "id": "prod-col-026",
    "sku": "OBS-COL-026",
    "name": "Corazón Amazonita",
    "category": "Collares",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.302Z",
    "imageUrl": "/productos/prod-col-026.jpeg",
    "hoverImageUrl": "/productos/prod-col-026-hover.jpeg"
  },
  {
    "id": "prod-col-027",
    "sku": "OBS-COL-027",
    "name": "Obsidiana",
    "category": "Collares",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.307Z",
    "imageUrl": "/productos/prod-col-027.jpeg",
    "hoverImageUrl": "/productos/prod-col-027-hover.jpeg"
  },
  {
    "id": "prod-col-028",
    "sku": "OBS-COL-028",
    "name": "Amatista",
    "category": "Collares",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.311Z",
    "imageUrl": "/productos/prod-col-028.jpeg",
    "hoverImageUrl": "/productos/prod-col-028-hover.jpeg"
  },
  {
    "id": "prod-col-029",
    "sku": "OBS-COL-029",
    "name": "Flor Cosmos",
    "category": "Collares",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.316Z",
    "imageUrl": "/productos/prod-col-029.jpeg",
    "hoverImageUrl": "/productos/prod-col-029-hover.jpeg"
  },
  {
    "id": "prod-col-030",
    "sku": "OBS-COL-030",
    "name": "Trebol",
    "category": "Collares",
    "price": 89,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:53:40.428Z",
    "imageUrl": "/productos/prod-col-030.jpeg",
    "hoverImageUrl": "/productos/prod-col-030-hover.jpeg"
  },
  {
    "id": "prod-col-031",
    "sku": "OBS-COL-031",
    "name": "Corazón Diamantado",
    "category": "Collares",
    "price": 79,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.327Z",
    "imageUrl": "/productos/prod-col-031.jpeg",
    "hoverImageUrl": "/productos/prod-col-031-hover.jpeg"
  },
  {
    "id": "prod-col-032",
    "sku": "OBS-COL-032",
    "name": "Estrella de Mar",
    "category": "Collares",
    "price": 79,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.332Z",
    "imageUrl": "/productos/prod-col-032.jpeg",
    "hoverImageUrl": "/productos/prod-col-032-hover.jpeg"
  },
  {
    "id": "prod-col-033",
    "sku": "OBS-COL-033",
    "name": "Estrella Lisa",
    "category": "Collares",
    "price": 79,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.337Z",
    "imageUrl": "/productos/prod-col-033.jpeg",
    "hoverImageUrl": "/productos/prod-col-033-hover.jpeg"
  },
  {
    "id": "prod-col-034",
    "sku": "OBS-COL-034",
    "name": "Cruz Andina",
    "category": "Collares",
    "price": 79,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.341Z",
    "imageUrl": "/productos/prod-col-034.jpeg",
    "hoverImageUrl": "/productos/prod-col-034-hover.jpeg"
  },
  {
    "id": "prod-col-035",
    "sku": "OBS-COL-035",
    "name": "Hoja Arce",
    "category": "Collares",
    "price": 79,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.346Z",
    "imageUrl": "/productos/prod-col-035.jpeg",
    "hoverImageUrl": "/productos/prod-col-035-hover.jpeg"
  },
  {
    "id": "prod-col-036",
    "sku": "OBS-COL-036",
    "name": "Collar Satelital",
    "category": "Collares",
    "price": 65,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.351Z",
    "imageUrl": "/productos/prod-col-036.jpeg",
    "hoverImageUrl": "/productos/prod-col-036-hover.jpeg"
  },
  {
    "id": "prod-col-037",
    "sku": "OBS-COL-037",
    "name": "Corazón Rojo",
    "category": "Collares",
    "price": 59,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.356Z",
    "imageUrl": "/productos/prod-col-037.jpeg",
    "hoverImageUrl": "/productos/prod-col-037-hover.jpeg"
  },
  {
    "id": "prod-col-038",
    "sku": "OBS-COL-038",
    "name": "Trebol Brillante",
    "category": "Pulseras",
    "price": 59,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Pulseras",
    "updatedAt": "2026-08-16T00:48:45.362Z",
    "imageUrl": "/productos/prod-col-038.jpeg",
    "hoverImageUrl": "/productos/prod-col-038-hover.jpeg"
  },
  {
    "id": "prod-col-039",
    "sku": "OBS-COL-039",
    "name": "Tres Lazos",
    "category": "Pulseras",
    "price": 55,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Pulseras",
    "updatedAt": "2026-08-16T00:48:45.368Z",
    "imageUrl": "/productos/prod-col-039.jpeg",
    "hoverImageUrl": "/productos/prod-col-039-hover.jpeg"
  },
  {
    "id": "prod-col-040",
    "sku": "OBS-COL-040",
    "name": "Corazones",
    "category": "Pulseras",
    "price": 55,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Pulseras",
    "updatedAt": "2026-08-16T00:48:45.374Z",
    "imageUrl": "/productos/prod-col-040.jpeg",
    "hoverImageUrl": "/productos/prod-col-040-hover.jpeg"
  },
  {
    "id": "prod-col-041",
    "sku": "OBS-COL-041",
    "name": "Eslabones Finos",
    "category": "Pulseras",
    "price": 49,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Pulseras",
    "updatedAt": "2026-08-16T00:48:45.378Z",
    "imageUrl": "/productos/prod-col-041.jpeg",
    "hoverImageUrl": "/productos/prod-col-041-hover.jpeg"
  },
  {
    "id": "prod-col-042",
    "sku": "OBS-COL-042",
    "name": "Eclipse",
    "category": "Collares",
    "price": 55,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Collares",
    "updatedAt": "2026-08-16T00:48:45.385Z",
    "imageUrl": "/productos/prod-col-042.jpeg",
    "hoverImageUrl": "/productos/prod-col-042-hover.jpeg"
  },
  {
    "id": "prod-col-043",
    "sku": "OBS-COL-043",
    "name": "Margarita",
    "category": "Anillos",
    "price": 49,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Anillos",
    "updatedAt": "2026-08-16T00:48:45.390Z",
    "imageUrl": "/productos/prod-col-043.jpeg",
    "hoverImageUrl": "/productos/prod-col-043-hover.jpeg"
  },
  {
    "id": "prod-col-044",
    "sku": "OBS-COL-044",
    "name": "Eslabones",
    "category": "Anillos",
    "price": 39,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Anillos",
    "updatedAt": "2026-08-16T00:53:40.435Z",
    "imageUrl": "/productos/prod-col-044.jpeg",
    "hoverImageUrl": "/productos/prod-col-044-hover.jpeg"
  },
  {
    "id": "prod-col-045",
    "sku": "OBS-COL-045",
    "name": "Órbita",
    "category": "Anillos",
    "price": 39,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Anillos",
    "updatedAt": "2026-08-16T00:48:45.402Z",
    "imageUrl": "/productos/prod-col-045.jpeg",
    "hoverImageUrl": "/productos/prod-col-045-hover.jpeg"
  },
  {
    "id": "prod-col-046",
    "sku": "OBS-COL-046",
    "name": "Infinito",
    "category": "Anillos",
    "price": 39,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Anillos",
    "updatedAt": "2026-08-16T00:48:45.406Z",
    "imageUrl": "/productos/prod-col-046.jpeg",
    "hoverImageUrl": "/productos/prod-col-046-hover.jpeg"
  },
  {
    "id": "prod-ani-047",
    "sku": "OBS-ANI-047",
    "name": "Corazón Circón",
    "category": "Anillos",
    "price": 39,
    "stock": 10,
    "minStock": 2,
    "location": "Vitrina Principal - Anillos",
    "updatedAt": "2026-08-16T00:48:45.411Z",
    "imageUrl": "/productos/prod-ani-047.jpeg",
    "hoverImageUrl": "/productos/prod-ani-047-hover.jpeg"
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

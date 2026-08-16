import { supabase } from '../lib/supabase';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface ProductoDB {
  id: string;
  nombre: string;
  categoria: string;
  material: string;
  precio: number;
  stock: number;
  stock_minimo?: number;
  sku?: string;
  ubicacion?: string;
  descripcion?: string;
  imagen_url?: string;
  peso_gramos?: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClienteDB {
  id?: string;
  nombre: string;
  doc_numero?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  referencia?: string;
  provincia?: string;
  distrito?: string;
  coords_lat?: number | null;
  coords_lng?: number | null;
}

export interface PedidoInput {
  numero_nota: string;
  cliente_id?: string;
  // Snapshot cliente
  cliente_nombre: string;
  cliente_doc?: string;
  cliente_telefono?: string;
  cliente_email?: string;
  cliente_direccion?: string;
  cliente_referencia?: string;
  cliente_provincia?: string;
  cliente_distrito?: string;
  cliente_zona?: string;
  cliente_notas?: string;
  cliente_coords_lat?: number | null;
  cliente_coords_lng?: number | null;
  // Totales
  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;
  adelanto: number;
  saldo: number;
  // Envío y pago
  tipo_entrega: string;
  agencia_envio?: string;
  sede_shalom?: string;
  metodo_pago: string;
  notas?: string;
  estado?: string;
  // Items
  items: {
    producto_id?: string;
    producto_nombre: string;
    material?: string;
    cantidad: number;
    precio_unitario: number;
    total: number;
  }[];
}

// ─── PRODUCTOS ────────────────────────────────────────────────────────────────

export const productosService = {
  async getAll(): Promise<ProductoDB[]> {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('categoria')
      .order('nombre');
    if (error) throw error;
    return data ?? [];
  },

  async updateStock(id: string, nuevoStock: number): Promise<void> {
    const { error } = await supabase
      .from('productos')
      .update({ stock: nuevoStock })
      .eq('id', id);
    if (error) throw error;
  },

  async create(producto: Omit<ProductoDB, 'id' | 'created_at' | 'updated_at'>): Promise<ProductoDB> {
    const { data, error } = await supabase
      .from('productos')
      .insert(producto)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, changes: Partial<ProductoDB>): Promise<void> {
    const { error } = await supabase
      .from('productos')
      .update(changes)
      .eq('id', id);
    if (error) throw error;
  },
};

// ─── CLIENTES ─────────────────────────────────────────────────────────────────

export const clientesService = {
  async buscarOCrear(datos: ClienteDB): Promise<string | null> {
    // Buscar por doc primero, luego por teléfono
    if (datos.doc_numero) {
      const { data } = await supabase
        .from('clientes')
        .select('id')
        .eq('doc_numero', datos.doc_numero)
        .maybeSingle();
      if (data?.id) {
        // Actualizar datos del cliente
        await supabase.from('clientes').update({
          nombre: datos.nombre,
          telefono: datos.telefono,
          email: datos.email,
          direccion: datos.direccion,
          referencia: datos.referencia,
          provincia: datos.provincia,
          distrito: datos.distrito,
          coords_lat: datos.coords_lat,
          coords_lng: datos.coords_lng,
        }).eq('id', data.id);
        return data.id;
      }
    }

    // Crear nuevo cliente
    const { data, error } = await supabase
      .from('clientes')
      .insert(datos)
      .select('id')
      .single();
    if (error) {
      console.error('Error creando cliente:', error);
      return null;
    }
    return data.id;
  },

  async getAll(): Promise<ClienteDB[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};

// ─── PEDIDOS ──────────────────────────────────────────────────────────────────

export const pedidosService = {
  async crear(input: PedidoInput): Promise<string> {
    const { items, ...pedidoData } = input;

    // Generar IDs si no vienen en input
    const randomSuffix = Math.floor(Math.random() * 100000);
    const payload = {
      ...pedidoData,
      numero_pedido: `PED-2026-${randomSuffix}`,
      codigo_tracking: `TRK-${randomSuffix}`,
      tarifa_envio: input.costo_envio,
      estado: pedidoData.estado ?? 'pendiente'
    };

    // 1. Crear pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .insert(payload)
      .select('id')
      .single();

    if (pedidoError) throw pedidoError;

    // 2. Insertar items (el trigger de stock se activa automáticamente)
    const itemsConPedido = items.map(item => ({
      ...item,
      pedido_id: pedido.id,
    }));

    const { error: itemsError } = await supabase
      .from('pedido_items')
      .insert(itemsConPedido);

    if (itemsError) throw itemsError;

    // 3. Registrar movimiento de caja
    await supabase.from('caja_movimientos').insert({
      tipo: 'ingreso',
      concepto: `Venta nota ${input.numero_nota}`,
      monto: input.adelanto > 0 ? input.adelanto : input.total,
      pedido_id: pedido.id,
      metodo_pago: input.metodo_pago,
    });

    return pedido.id;
  },

  async getAll(limit = 50): Promise<any[]> {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        pedido_items (*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  },

  async updateEstado(id: string, estado: string): Promise<void> {
    const { error } = await supabase
      .from('pedidos')
      .update({ estado })
      .eq('id', id);
    if (error) throw error;
  },

  async getByNumero(numero: string): Promise<any> {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, pedido_items(*)')
      .eq('numero_nota', numero)
      .single();
    if (error) throw error;
    return data;
  },
};

// ─── ZONAS / PROVINCIAS ───────────────────────────────────────────────────────

export const configService = {
  async getZonas() {
    const { data, error } = await supabase
      .from('zonas')
      .select('*')
      .eq('estado', 'active')
      .order('nombre');
    if (error) throw error;
    return data ?? [];
  },

  async getProvincias() {
    const { data, error } = await supabase
      .from('provincias')
      .select('*')
      .order('nombre');
    if (error) throw error;
    return data ?? [];
  },
};

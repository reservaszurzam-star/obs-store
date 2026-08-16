import { supabase } from './supabase';
import { Province, Zone, District } from '../types';

export const zonasService = {
  // PROVINCIAS
  async getProvincias(): Promise<Province[]> {
    const { data, error } = await supabase
      .from('provincias')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;

    return (data || []).map(p => ({
      id: p.id,
      name: p.nombre,
      code: p.codigo,
    }));
  },

  // ZONAS
  async getZonas(): Promise<Zone[]> {
    const { data, error } = await supabase
      .from('zonas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(z => ({
      id: z.id,
      name: z.nombre,
      provinceId: z.provincia_id,
      shippingFee: Number(z.tarifa_envio),
      estimatedDays: z.dias_estimados,
      courierAssigned: z.courier_asignado,
      status: z.estado,
    }));
  },

  async crearZona(zonaData: Omit<Zone, 'id' | 'status'>): Promise<Zone> {
    const newId = `zone-${Date.now()}`;
    const dbZone = {
      id: newId,
      nombre: zonaData.name,
      provincia_id: zonaData.provinceId,
      tarifa_envio: zonaData.shippingFee,
      dias_estimados: zonaData.estimatedDays,
      courier_asignado: zonaData.courierAssigned,
      estado: 'active',
    };

    const { error } = await supabase.from('zonas').insert([dbZone]);

    if (error) throw error;

    return {
      id: newId,
      name: dbZone.nombre,
      provinceId: dbZone.provincia_id,
      shippingFee: Number(dbZone.tarifa_envio),
      estimatedDays: dbZone.dias_estimados,
      courierAssigned: dbZone.courier_asignado,
      status: 'active',
    };
  },

  async actualizarZona(zonaId: string, updates: Partial<Zone>): Promise<void> {
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.nombre = updates.name;
    if (updates.shippingFee !== undefined) dbUpdates.tarifa_envio = updates.shippingFee;
    if (updates.estimatedDays !== undefined) dbUpdates.dias_estimados = updates.estimatedDays;
    if (updates.courierAssigned !== undefined) dbUpdates.courier_asignado = updates.courierAssigned;
    if (updates.status !== undefined) dbUpdates.estado = updates.status;

    const { error } = await supabase
      .from('zonas')
      .update(dbUpdates)
      .eq('id', zonaId);

    if (error) throw error;
  },

  async eliminarZona(zonaId: string): Promise<void> {
    const { error } = await supabase
      .from('zonas')
      .delete()
      .eq('id', zonaId);

    if (error) throw error;
  },

  // DISTRITOS
  async getDistritos(): Promise<District[]> {
    const { data, error } = await supabase
      .from('distritos')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw error;

    return (data || []).map(d => ({
      id: d.id,
      name: d.nombre,
      provinceId: d.provincia_id,
      zoneId: d.zona_id,
    }));
  },

  async crearDistrito(distritoData: Omit<District, 'id'>): Promise<District> {
    const newId = `dist-${Date.now()}`;
    const dbDistrito = {
      id: newId,
      nombre: distritoData.name,
      provincia_id: distritoData.provinceId,
      zona_id: distritoData.zoneId,
    };

    const { error } = await supabase.from('distritos').insert([dbDistrito]);

    if (error) throw error;

    return {
      id: newId,
      name: dbDistrito.nombre,
      provinceId: dbDistrito.provincia_id,
      zoneId: dbDistrito.zona_id,
    };
  },

  async eliminarDistrito(distritoId: string): Promise<void> {
    const { error } = await supabase
      .from('distritos')
      .delete()
      .eq('id', distritoId);

    if (error) throw error;
  }
};

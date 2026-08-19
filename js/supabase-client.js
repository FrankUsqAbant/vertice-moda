/**
 * VÉRTICE — Supabase Database Integration (Free Tier Client)
 * Manages Product Catalog, Inventory & Yape Order Logs
 */

// Supabase Configuration (Free Tier)
// Reemplaza con tus credenciales de Supabase Dashboard (Project Settings > API)
const SUPABASE_CONFIG = {
  url: window.ENV_SUPABASE_URL || 'https://xyzcompany.supabase.co',
  anonKey: window.ENV_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  isDemo: true // En modo demo guarda localmente hasta conectar las credenciales reales
};

class VerticeDB {
  constructor() {
    this.client = null;
    this.init();
  }

  init() {
    try {
      if (window.supabase && SUPABASE_CONFIG.url !== 'https://xyzcompany.supabase.co') {
        this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        console.log('⚡ Conectado exitosamente a Supabase Free Tier');
      } else {
        console.log('📦 VÉRTICE DB: Modo local reactivo activo (Listo para conectar Supabase)');
      }
    } catch (e) {
      console.warn('Fallback a almacenamiento local:', e);
    }
  }

  // Guardar pedido registrado con Yape
  async saveYapeOrder(order) {
    const payload = {
      cliente_nombre: order.clientName || 'Cliente Vértice',
      telefono: order.phone || 'No especificado',
      total_pen: order.total,
      metodo_pago: 'YAPE',
      estado: 'PENDIENTE_VALIDACION',
      items: order.items,
      created_at: new Date().toISOString()
    };

    if (this.client) {
      try {
        const { data, error } = await this.client.from('pedidos').insert([payload]);
        if (error) throw error;
        console.log('✅ Pedido guardado en Supabase:', data);
        return { success: true, source: 'supabase', data };
      } catch (err) {
        console.warn('Error al guardar en Supabase, guardando localmente:', err);
      }
    }

    // Fallback Local Storage
    const existing = JSON.parse(localStorage.getItem('vertice_yape_orders') || '[]');
    existing.push(payload);
    localStorage.setItem('vertice_yape_orders', JSON.stringify(existing));
    return { success: true, source: 'local', data: payload };
  }

  // Obtener pedidos guardados
  async getOrders() {
    if (this.client) {
      try {
        const { data, error } = await this.client.from('pedidos').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {}
    }
    return JSON.parse(localStorage.getItem('vertice_yape_orders') || '[]');
  }
}

// Global instance
window.verticeDB = new VerticeDB();

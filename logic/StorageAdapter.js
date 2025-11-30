// StorageAdapter.js
// ============================================
// Responsable de guardar y cargar datos en el navegador
// Utiliza localStorage para persistencia (los datos se guardan incluso al cerrar el navegador)
// ============================================

export class StorageAdapter {
  constructor() {
    // Claves para identificar dónde se guardan los datos en el navegador
    this.KEY_CREATURES = 'p_game_creatures_v1';
    this.KEY_POINTS = 'p_game_points_v1';
  }

  // Guardar la lista de criaturas en el navegador (en formato JSON)
  saveCreatures(list) {
    localStorage.setItem(this.KEY_CREATURES, JSON.stringify(list));
    // Notificar a toda la aplicación que los datos cambiaron
    window.dispatchEvent(new Event('game:storageChanged'));
  }

  // Cargar la lista de criaturas guardadas
  loadCreatures() {
    const raw = localStorage.getItem(this.KEY_CREATURES);
    if (!raw) return [];
    try { 
      return JSON.parse(raw); 
    } catch(_) { 
      return []; // Si hay error al leer, devolver lista vacía
    }
  }

  // Guardar cantidad total de puntos
  savePoints(n) {
    localStorage.setItem(this.KEY_POINTS, String(n));
    // Notificar a la aplicación que los puntos cambiaron
    window.dispatchEvent(new Event('game:pointsChanged'));
  }

  // Cargar cantidad de puntos guardados
  loadPoints() {
    const raw = localStorage.getItem(this.KEY_POINTS);
    return raw ? Number(raw) : 0;
  }

  // Borrar todos los datos (reiniciar juego)
  reset() {
    localStorage.removeItem(this.KEY_CREATURES);
    localStorage.removeItem(this.KEY_POINTS);
    window.dispatchEvent(new Event('game:storageChanged'));
    window.dispatchEvent(new Event('game:pointsChanged'));
  }
}

// Instancia única del adaptador que se usa en toda la aplicación
export const storageAdapter = new StorageAdapter();

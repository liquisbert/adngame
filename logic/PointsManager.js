// PointsManager.js
// ============================================
// Gestor de puntos: controla cuántos puntos tiene el jugador
// Los puntos se usan para crear criaturas y alimentarlas
// ============================================

import { storageAdapter } from './StorageAdapter.js';

export class PointsManager {
  constructor() {
    // Singleton: solo existe una instancia en toda la aplicación
    if (PointsManager._instance) return PointsManager._instance;
    
    // Cargar los puntos guardados, o empezar con 0 si es la primera vez
    this._points = storageAdapter.loadPoints() || 0;
    PointsManager._instance = this;
  }

  static instance() {
    return PointsManager._instance || new PointsManager();
  }

  // Obtener la cantidad actual de puntos
  getPoints() { 
    return this._points; 
  }

  // Añadir puntos (por ejemplo, al acariciar una criatura o comprar)
  addPoints(n) {
    this._points += Number(n || 0);
    storageAdapter.savePoints(this._points);
    // Notificar a toda la interfaz que los puntos cambiaron
    window.dispatchEvent(new Event('game:pointsChanged'));
  }

  // Gastar puntos (por ejemplo, para crear o alimentar una criatura)
  // Devuelve true si se pudo gastar, false si no había suficientes puntos
  spendPoints(n) {
    n = Number(n);
    if (this._points >= n) {
      this._points -= n;
      storageAdapter.savePoints(this._points);
      window.dispatchEvent(new Event('game:pointsChanged'));
      return true;
    }
    return false;
  }

  // Establecer una cantidad específica de puntos
  setPoints(n) {
    this._points = Number(n);
    storageAdapter.savePoints(this._points);
    window.dispatchEvent(new Event('game:pointsChanged'));
  }

  // Reiniciar puntos a 0 (al resetear el juego)
  reset() {
    this._points = 0;
    storageAdapter.savePoints(this._points);
    window.dispatchEvent(new Event('game:pointsChanged'));
  }
}

// Instancia única del gestor de puntos
export const PointsManagerSingleton = PointsManager.instance();

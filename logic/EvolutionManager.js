// EvolutionManager.js
// ============================================
// Gestor de evoluciones: controla qué formas puede tomar cada nivel
// Define cuánta comida se necesita para llegar a cada nivel
// ============================================

import { ADN_EVOLUTIONS } from '../config.js';

export class EvolutionManager {
  constructor() {
    // Singleton: solo una instancia en toda la aplicación
    if (EvolutionManager._instance) return EvolutionManager._instance;
    EvolutionManager._instance = this;
  }

  static instance() {
    return EvolutionManager._instance || new EvolutionManager();
  }

  // Retorna la cantidad de puntos de comida necesarios para alcanzar un nivel
  // Regla: para llegar a nivel N, necesitas N puntos de comida (ej: nivel 2 = 2 comida, nivel 3 = 3 comida)
  requiredFoodForLevel(targetLevel) {
    return Number(targetLevel);
  }

  // Retorna las opciones de formas disponibles para un nivel (ej: nivel 3 = ["perro", "gato", "conejo"])
  optionsForLevel(level) {
    return ADN_EVOLUTIONS[level] || [];
  }
}
export const EvolutionManagerSingleton = EvolutionManager.instance();

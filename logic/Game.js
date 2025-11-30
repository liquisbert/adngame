// Game.js
// ============================================
// Orquestador principal del juego
// Centraliza el acceso a todos los managers (criaturas, puntos, evoluciones, fusiones)
// ============================================

import { CreatureManager } from './CreatureManager.js';
import { PointsManager } from './PointsManager.js';
import { EvolutionManager } from './EvolutionManager.js';
import { FusionManager } from './FusionManager.js';
import { storageAdapter } from './StorageAdapter.js';

export class Game {
  constructor() {
    // Patrón Singleton: asegurar que solo exista una instancia del juego
    if (Game._instance) return Game._instance;
    
    // Inicializar todos los componentes principales del juego
    this.creatures = CreatureManager.instance();    // Gestiona la lista de criaturas
    this.points = PointsManager.instance();          // Gestiona los puntos del jugador
    this.evolution = EvolutionManager.instance();    // Gestiona las opciones de evolución
    this.fusion = FusionManager.instance();          // Gestiona las fusiones entre criaturas
    Game._instance = this;

    // Escuchar cambios en el almacenamiento para mantener todo sincronizado
    window.addEventListener('game:storageChanged', ()=> {});
  }

  // Obtener la instancia única del juego (crear si no existe)
  static instance() {
    return Game._instance || new Game();
  }

  // Reiniciar completamente el juego (borrar todo)
  resetAll() {
    storageAdapter.reset();
    // Recargar los managers para que reflejen el estado vacío
    this.creatures = CreatureManager.instance();
    this.points.reset();
    // Notificar a toda la interfaz que todo cambió
    window.dispatchEvent(new Event('game:storageChanged'));
    window.dispatchEvent(new Event('game:pointsChanged'));
  }
}

// Exportar la instancia única para usarla en toda la aplicación
export const GameInstance = Game.instance();

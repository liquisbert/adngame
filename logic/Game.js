// Game.js
import { CreatureManager } from './CreatureManager.js';
import { PointsManager } from './PointsManager.js';
import { EvolutionManager } from './EvolutionManager.js';
import { FusionManager } from './FusionManager.js';
import { storageAdapter } from './StorageAdapter.js';

export class Game {
  constructor() {
    if (Game._instance) return Game._instance;
    this.creatures = CreatureManager.instance();
    this.points = PointsManager.instance();
    this.evolution = EvolutionManager.instance();
    this.fusion = FusionManager.instance();
    Game._instance = this;

    // forward storage events
    window.addEventListener('game:storageChanged', ()=> {});
  }

  static instance() {
    return Game._instance || new Game();
  }

  resetAll() {
    storageAdapter.reset();
    this.creatures = CreatureManager.instance(); // reload
    this.points.reset();
    window.dispatchEvent(new Event('game:storageChanged'));
    window.dispatchEvent(new Event('game:pointsChanged'));
  }
}
export const GameInstance = Game.instance();

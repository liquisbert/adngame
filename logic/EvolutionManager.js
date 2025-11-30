// EvolutionManager.js
import { ADN_EVOLUTIONS } from '../config.js';

export class EvolutionManager {
  constructor() {
    if (EvolutionManager._instance) return EvolutionManager._instance;
    EvolutionManager._instance = this;
  }

  static instance() {
    return EvolutionManager._instance || new EvolutionManager();
  }

  requiredFoodForLevel(targetLevel) {
    // rule: to reach level N each creature must have N food points (as described)
    return Number(targetLevel);
  }

  optionsForLevel(level) {
    return ADN_EVOLUTIONS[level] || [];
  }
}
export const EvolutionManagerSingleton = EvolutionManager.instance();

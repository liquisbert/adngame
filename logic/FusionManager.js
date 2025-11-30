// FusionManager.js
import { CreatureManager } from './CreatureManager.js';
import { EvolutionManager } from './EvolutionManager.js';
import { Creature } from './Creature.js';
import { FusedOrganism } from './FusedOrganism.js';

export class FusionManager {
  constructor() {
    if (FusionManager._instance) return FusionManager._instance;
    FusionManager._instance = this;
  }

  static instance() {
    return FusionManager._instance || new FusionManager();
  }

  canFuse(a, b) {
    if (!a || !b) return false;
    if (a.id === b.id) return false;
    if (a.level !== b.level) return false;
    const target = a.level + 1;
    const req = EvolutionManager.instance().requiredFoodForLevel(target);
    return (a.foodPoints >= req && b.foodPoints >= req);
  }

  /**
   * Fusiona dos criaturas y retorna un FusedOrganism
   * El hijo es una especialización que hereda de ambos padres
   */
  fuse(aId, bId) {
    const cm = CreatureManager.instance();
    const a = cm.get(aId);
    const b = cm.get(bId);
    if (!this.canFuse(a, b)) throw new Error('Cannot fuse');

    // Crear organismo fusionado (especialización de Creature)
    const newCreature = new FusedOrganism({
      id: FusedOrganism.generateId(),
      name: `${a.name}-${b.name}`,
      level: a.level + 1,
      foodPoints: 0,
      spriteKey: null,
      historyADN: [...(a.historyADN || []), ...(b.historyADN || [])],
      createdAt: Date.now(),
      parentIds: [a.id, b.id]
    });

    // remove originals and add new
    const remaining = cm.all().filter(x => x.id !== a.id && x.id !== b.id);
    remaining.push(newCreature);
    cm.replaceMany(remaining);
    return newCreature;
  }
}
export const FusionManagerSingleton = FusionManager.instance();

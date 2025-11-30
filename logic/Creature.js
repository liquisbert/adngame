// Creature.js
import { OrganismBase } from './OrganismBase.js';

/**
 * Creature es una especialización de OrganismBase
 * Hereda propiedades base y métodos comunes
 * Puede ser extendida por otras clases (ej: FusedOrganism)
 */
export class Creature extends OrganismBase {
  constructor(params) {
    super(params);
    // Las subclases pueden agregar propiedades específicas aquí
  }

  /**
   * Método especializado: clona como Creature (no otra subclase)
   */
  cloneAsNextLevel() {
    return new Creature({
      id: Creature.generateId(),
      name: `${this.name}`,
      level: this.level + 1,
      foodPoints: 0,
      spriteKey: null,
      historyADN: [...this.historyADN],
      createdAt: Date.now()
    });
  }

  /**
   * Hook: puede ser extendido por subclases
   */
  static fromJSON(obj) {
    return new Creature(obj);
  }
}

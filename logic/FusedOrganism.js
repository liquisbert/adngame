// FusedOrganism.js
import { Creature } from './Creature.js';

/**
 * FusedOrganism es una especialización de Creature
 * Representa criaturas que nacen de la fusión de dos padres
 * Hereda propiedades base y agrega características de linaje
 */
export class FusedOrganism extends Creature {
  constructor({ id, name, level = 1, foodPoints = 0, spriteKey = 'sombra', historyADN = [], createdAt = null, parentIds = [] }) {
    super({ id, name, level, foodPoints, spriteKey, historyADN, createdAt });
    this.parentIds = parentIds; // IDs de los dos progenitores
  }

  /**
   * Método especializado: FusedOrganism genera Creature en próxima generación
   */
  cloneAsNextLevel() {
    // Después de fusión, la descendencia vuelve a ser Creature regular
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
   * Obtiene información sobre los padres
   */
  getParentInfo() {
    return {
      parentCount: this.parentIds.length,
      parentIds: this.parentIds
    };
  }

  /**
   * Serializar incluyendo información de padres
   */
  toJSON() {
    return {
      ...super.toJSON(),
      parentIds: this.parentIds,
      type: 'FusedOrganism'
    };
  }

  static fromJSON(obj) {
    return new FusedOrganism(obj);
  }
}

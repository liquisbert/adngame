// OrganismBase.js
/**
 * Clase base para todos los organismos del juego
 * Define propiedades comunes y métodos que pueden ser extendidos
 */
export class OrganismBase {
  constructor({ id, name, level = 1, foodPoints = 0, spriteKey = 'sombra', historyADN = [], createdAt = null }) {
    this.id = id || this.constructor.generateId();
    this.name = name || 'Organismo';
    this.level = level;
    this.foodPoints = foodPoints;
    this.spriteKey = spriteKey;
    this.historyADN = historyADN || [];
    this.createdAt = createdAt || Date.now();
  }

  /**
   * Genera ID único
   */
  static generateId() {
    return Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000).toString(36);
  }

  /**
   * Alimentar el organismo
   */
  feed(amount = 1) {
    this.foodPoints = (this.foodPoints || 0) + amount;
    return this.foodPoints;
  }

  /**
   * Limpiar comida (después de evolución/fusión)
   */
  clearFood() {
    this.foodPoints = 0;
  }

  /**
   * Aplicar ADN (cambiar sprite e historial)
   */
  applyADN(adnKey) {
    this.spriteKey = adnKey;
    this.historyADN.push(adnKey);
  }

  /**
   * Obtiene el sprite actual
   */
  getCurrentSprite() {
    return this.spriteKey || (this.level === 1 ? 'sombra' : 'sombra');
  }

  /**
   * Verifica si puede evolucionar (tiene suficiente comida)
   */
  canEvolve(requiredFood) {
    return this.foodPoints >= requiredFood;
  }

  /**
   * Clona el organismo para la siguiente generación
   */
  cloneAsNextLevel() {
    return new this.constructor({
      id: this.constructor.generateId(),
      name: this.name,
      level: this.level + 1,
      foodPoints: 0,
      spriteKey: null,
      historyADN: [...this.historyADN],
      createdAt: Date.now()
    });
  }

  /**
   * Serializar a JSON
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      level: this.level,
      foodPoints: this.foodPoints,
      spriteKey: this.spriteKey,
      historyADN: this.historyADN,
      createdAt: this.createdAt
    };
  }

  /**
   * Deserializar desde JSON
   */
  static fromJSON(obj) {
    return new this(obj);
  }
}

// OrganismBase.js
// ============================================
// Clase base para todos los organismos (criaturas normales y fusionadas)
// Contiene propiedades comunes: nombre, nivel, comida, forma visual (sprite), evolución
// Proporciona métodos para alimentar, aplicar ADN (evolucionar) y clonar
// ============================================

/**
 * Clase base para todos los organismos del juego
 * Define propiedades comunes y métodos que pueden ser extendidos
 */
export class OrganismBase {
  constructor({ id, name, level = 1, foodPoints = 0, spriteKey = 'sombra', historyADN = [], createdAt = null }) {
    // ID único para identificar cada organismo
    this.id = id || this.constructor.generateId();
    // Nombre que le dio el jugador
    this.name = name || 'Organismo';
    // Nivel de evolución (1 inicial, 7 máximo)
    this.level = level;
    // Puntos de comida acumulados (necesarios para evolucionar)
    this.foodPoints = foodPoints;
    // Clave de la forma visual (emoji) actual
    this.spriteKey = spriteKey;
    // Registro de formas que ha tenido (historial de evoluciones)
    this.historyADN = historyADN || [];
    // Timestamp de cuándo se creó
    this.createdAt = createdAt || Date.now();
  }

  /**
   * Genera ID único basado en timestamp y random
   */
  static generateId() {
    return Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000).toString(36);
  }

  /**
   * Alimentar el organismo (suma puntos de comida)
   */
  feed(amount = 1) {
    this.foodPoints = (this.foodPoints || 0) + amount;
    return this.foodPoints;
  }

  /**
   * Limpiar comida (se usa después de evolucionar o fusionar)
   */
  clearFood() {
    this.foodPoints = 0;
  }

  /**
   * Aplicar ADN: cambiar la forma (sprite) actual y guardar en el historial
   */
  applyADN(adnKey) {
    this.spriteKey = adnKey;
    this.historyADN.push(adnKey);
  }

  /**
   * Obtiene el sprite (emoji) a mostrar en la interfaz
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

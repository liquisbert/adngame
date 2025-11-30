// CreatureManager.js
// ============================================
// Gestor de criaturas: crear, obtener, actualizar y eliminar
// Mantiene la lista en memoria y sincroniza con el almacenamiento
// ============================================

import { storageAdapter } from './StorageAdapter.js';
import { Creature } from './Creature.js';
import { FusedOrganism } from './FusedOrganism.js';

export class CreatureManager {
  constructor() {
    // Singleton: solo una instancia en toda la aplicación
    if (CreatureManager._instance) return CreatureManager._instance;
    
    // Cargar criaturas guardadas y convertirlas al tipo correcto (Creature o FusedOrganism)
    this._list = storageAdapter.loadCreatures().map(data => this._deserialize(data));
    CreatureManager._instance = this;
  }

  static instance() {
    return CreatureManager._instance || new CreatureManager();
  }

  // Convertir un objeto JSON guardado al tipo de clase correcto
  // Esto permite manejar tanto criaturas normales como fusionadas
  _deserialize(data) {
    if (data.type === 'FusedOrganism') {
      return FusedOrganism.fromJSON(data);
    }
    // Por defecto, retorna una Criatura normal
    return Creature.fromJSON(data);
  }

  // Obtener lista de todas las criaturas (ordenadas por más recientes primero)
  all() {
    return this._list.slice().sort((a, b) => b.createdAt - a.createdAt);
  }

  // Crear una nueva criatura y guardarla
  create({ name }) {
    const c = new Creature({ name });
    this._list.push(c);
    this._save();
    return c;
  }

  // Obtener una criatura por su ID
  get(id) {
    return this._list.find(x => x.id === id) || null;
  }

  // Actualizar una criatura (cambiar nombre, puntos, forma, etc)
  update(id, patch) {
    const idx = this._list.findIndex(x => x.id === id);
    if (idx === -1) return null;
    // Combinar los datos existentes con los cambios
    Object.assign(this._list[idx], patch);
    this._save();
    return this._list[idx];
  }

  // Eliminar una criatura de la lista
  remove(id) {
    this._list = this._list.filter(x => x.id !== id);
    this._save();
  }

  // Reemplazar toda la lista de criaturas (usado para fusiones)
  replaceMany(newList) {
    this._list = newList;
    this._save();
  }

  // Guardar todos los cambios en el almacenamiento del navegador
  _save() {
    storageAdapter.saveCreatures(this._list.map(x => x.toJSON()));
  }
}

// Instancia única del gestor
export const CreatureManagerSingleton = CreatureManager.instance();

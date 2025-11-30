// CreatureManager.js
import { storageAdapter } from './StorageAdapter.js';
import { Creature } from './Creature.js';
import { FusedOrganism } from './FusedOrganism.js';

export class CreatureManager {
  constructor() {
    if (CreatureManager._instance) return CreatureManager._instance;
    this._list = storageAdapter.loadCreatures().map(data => this._deserialize(data));
    CreatureManager._instance = this;
  }

  static instance() {
    return CreatureManager._instance || new CreatureManager();
  }

  /**
   * Deserializa un organismo del tipo correcto
   * Lee el tipo y crea la instancia apropiada (Creature o FusedOrganism)
   */
  _deserialize(data) {
    if (data.type === 'FusedOrganism') {
      return FusedOrganism.fromJSON(data);
    }
    // Por defecto, retorna Creature
    return Creature.fromJSON(data);
  }

  all() {
    // return copy
    return this._list.slice().sort((a, b) => b.createdAt - a.createdAt);
  }

  create({ name }) {
    const c = new Creature({ name });
    this._list.push(c);
    this._save();
    return c;
  }

  get(id) {
    return this._list.find(x => x.id === id) || null;
  }

  update(id, patch) {
    const idx = this._list.findIndex(x => x.id === id);
    if (idx === -1) return null;
    Object.assign(this._list[idx], patch);
    this._save();
    return this._list[idx];
  }

  remove(id) {
    this._list = this._list.filter(x => x.id !== id);
    this._save();
  }

  replaceMany(newList) {
    this._list = newList;
    this._save();
  }

  _save() {
    storageAdapter.saveCreatures(this._list.map(x => x.toJSON()));
  }
}
export const CreatureManagerSingleton = CreatureManager.instance();

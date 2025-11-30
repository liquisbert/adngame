// StorageAdapter.js
export class StorageAdapter {
  constructor() {
    this.KEY_CREATURES = 'p_game_creatures_v1';
    this.KEY_POINTS = 'p_game_points_v1';
  }

  saveCreatures(list) {
    localStorage.setItem(this.KEY_CREATURES, JSON.stringify(list));
    window.dispatchEvent(new Event('game:storageChanged'));
  }

  loadCreatures() {
    const raw = localStorage.getItem(this.KEY_CREATURES);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch(_) { return []; }
  }

  savePoints(n) {
    localStorage.setItem(this.KEY_POINTS, String(n));
    window.dispatchEvent(new Event('game:pointsChanged'));
  }

  loadPoints() {
    const raw = localStorage.getItem(this.KEY_POINTS);
    return raw ? Number(raw) : 0;
  }

  reset() {
    localStorage.removeItem(this.KEY_CREATURES);
    localStorage.removeItem(this.KEY_POINTS);
    window.dispatchEvent(new Event('game:storageChanged'));
    window.dispatchEvent(new Event('game:pointsChanged'));
  }
}
export const storageAdapter = new StorageAdapter();

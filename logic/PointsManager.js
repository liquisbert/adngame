// PointsManager.js
import { storageAdapter } from './StorageAdapter.js';

export class PointsManager {
  constructor() {
    if (PointsManager._instance) return PointsManager._instance;
    this._points = storageAdapter.loadPoints() || 0;
    PointsManager._instance = this;
  }

  static instance() {
    return PointsManager._instance || new PointsManager();
  }

  getPoints() { return this._points; }

  addPoints(n) {
    this._points += Number(n || 0);
    storageAdapter.savePoints(this._points);
    window.dispatchEvent(new Event('game:pointsChanged'));
  }

  spendPoints(n) {
    n = Number(n);
    if (this._points >= n) {
      this._points -= n;
      storageAdapter.savePoints(this._points);
      window.dispatchEvent(new Event('game:pointsChanged'));
      return true;
    }
    return false;
  }

  setPoints(n) {
    this._points = Number(n);
    storageAdapter.savePoints(this._points);
    window.dispatchEvent(new Event('game:pointsChanged'));
  }

  reset() {
    this._points = 0;
    storageAdapter.savePoints(this._points);
    window.dispatchEvent(new Event('game:pointsChanged'));
  }
}
export const PointsManagerSingleton = PointsManager.instance();

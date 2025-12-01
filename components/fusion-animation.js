// fusion-animation.js
// ============================================
// Componente de animación visual para la fusión de criaturas
// Muestra ambas criaturas acercándose, fusionándose con efectos de luz y revelando la nueva criatura
// ============================================

import { SPRITES } from '../config.js';

const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    @keyframes slideInFromLeft {
      from { transform: translateX(-200px) scale(0.8); opacity: 0; }
      to { transform: translateX(0) scale(1); opacity: 1; }
    }
    
    @keyframes slideInFromRight {
      from { transform: translateX(200px) scale(0.8); opacity: 0; }
      to { transform: translateX(0) scale(1); opacity: 1; }
    }
    
    @keyframes merge {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; filter: brightness(2); }
      100% { transform: scale(0); opacity: 0; }
    }
    
    @keyframes glowPulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.5); }
    }
    
    @keyframes reveal {
      0% { transform: scale(0); opacity: 0; filter: brightness(3); }
      50% { transform: scale(1.2); opacity: 1; filter: brightness(2); }
      100% { transform: scale(1); opacity: 1; filter: brightness(1); }
    }
    
    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: translate(0, 0) scale(0); }
      50% { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1); }
    }
    
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .stage {
      position: relative;
      width: 400px;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .creature {
      position: absolute;
      font-size: 80px;
      text-shadow: 0 0 20px rgba(29, 78, 216, 0.6);
    }
    
    .creature-left {
      left: 20%;
      animation: slideInFromLeft 0.8s ease-out forwards;
    }
    
    .creature-right {
      right: 20%;
      animation: slideInFromRight 0.8s ease-out forwards;
    }
    
    .creature.merging {
      animation: merge 1s ease-in-out 1.2s forwards;
    }
    
    .glow {
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.6), rgba(29, 78, 216, 0.3), transparent);
      opacity: 0;
      animation: glowPulse 1.5s ease-in-out 1s infinite;
    }
    
    .new-creature {
      position: absolute;
      font-size: 100px;
      opacity: 0;
      animation: reveal 1s ease-out 2.2s forwards;
      text-shadow: 0 0 30px rgba(59, 130, 246, 0.8);
    }
    
    .sparkles {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    
    .sparkle {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 8px;
      height: 8px;
      background: #60A5FA;
      border-radius: 50%;
      opacity: 0;
    }
    
    .sparkle:nth-child(1) { --tx: -60px; --ty: -80px; animation: sparkle 1.5s ease-out 1.5s; }
    .sparkle:nth-child(2) { --tx: 60px; --ty: -70px; animation: sparkle 1.5s ease-out 1.6s; }
    .sparkle:nth-child(3) { --tx: -80px; --ty: 30px; animation: sparkle 1.5s ease-out 1.7s; }
    .sparkle:nth-child(4) { --tx: 80px; --ty: 40px; animation: sparkle 1.5s ease-out 1.8s; }
    .sparkle:nth-child(5) { --tx: 0px; --ty: -100px; animation: sparkle 1.5s ease-out 1.65s; }
    .sparkle:nth-child(6) { --tx: -40px; --ty: 70px; animation: sparkle 1.5s ease-out 1.75s; }
    .sparkle:nth-child(7) { --tx: 40px; --ty: -50px; animation: sparkle 1.5s ease-out 1.55s; }
    .sparkle:nth-child(8) { --tx: 90px; --ty: -20px; animation: sparkle 1.5s ease-out 1.85s; }
    
    .fusion-text {
      position: absolute;
      bottom: 20px;
      font-size: 24px;
      font-weight: 700;
      color: #3B82F6;
      text-shadow: 0 2px 10px rgba(59, 130, 246, 0.6);
      opacity: 0;
      animation: fadeIn 0.5s ease-out 0.5s forwards, fadeOut 0.5s ease-out 2.8s forwards;
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  </style>
  <div class="overlay">
    <div class="stage">
      <div class="creature creature-left" id="creatureA">?</div>
      <div class="creature creature-right" id="creatureB">?</div>
      <div class="glow"></div>
      <div class="sparkles">
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
      </div>
      <div class="new-creature" id="newCreature">✨</div>
      <div class="fusion-text">¡Fusión!</div>
    </div>
  </div>
`;

class FusionAnimation extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(tpl.content.cloneNode(true));
  }

  /**
   * Inicializa y reproduce la animación de fusión
   * @param {string} spriteKeyA - Clave del sprite de la criatura A
   * @param {string} spriteKeyB - Clave del sprite de la criatura B
   * @param {string} newSpriteKey - Clave del sprite de la nueva criatura fusionada
   * @param {Function} onComplete - Callback al finalizar la animación
   */
  play(spriteKeyA, spriteKeyB, newSpriteKey, onComplete) {
    const creatureAEl = this.shadowRoot.getElementById('creatureA');
    const creatureBEl = this.shadowRoot.getElementById('creatureB');
    const newCreatureEl = this.shadowRoot.getElementById('newCreature');

    // Establecer sprites
    creatureAEl.textContent = SPRITES[spriteKeyA] || '?';
    creatureBEl.textContent = SPRITES[spriteKeyB] || '?';
    newCreatureEl.textContent = SPRITES[newSpriteKey] || '✨';

    // Agregar clase de fusión después de la entrada
    setTimeout(() => {
      creatureAEl.classList.add('merging');
      creatureBEl.classList.add('merging');
    }, 1200);

    // Remover el componente y ejecutar callback al finalizar (3.3s total)
    setTimeout(() => {
      if (onComplete) onComplete();
      this.remove();
    }, 3300);
  }
}

customElements.define('fusion-animation', FusionAnimation);

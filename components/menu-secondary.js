// menu-secondary.js
import { PointsManager } from '../logic/PointsManager.js';

const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes float { 0%, 100% { transform: translateY(-2px); } 50% { transform: translateY(-8px); } }
    @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(29, 78, 216, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(29, 78, 216, 0); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes countPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    
    .container { 
      position: absolute; 
      right: 16px; 
      bottom: 18px; 
      display: flex;
      flex-direction: column;
      gap: 12px;
      animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      align-items: flex-end;
    }
    
    .points-display {
      background: linear-gradient(135deg, #051e3e, #0a3550);
      border: 2px solid #1D4ED8;
      border-radius: 12px;
      padding: 8px 16px;
      color: #3B82F6;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: slideUp 0.5s ease-out 0.05s both, popIn 0.4s ease-out;
      box-shadow: 0 4px 12px rgba(29, 78, 216, 0.28);
      min-width: 140px;
      justify-content: center;
    }
    
    .points-display:hover {
      border-color: #3B82F6;
      box-shadow: 0 6px 16px rgba(29, 78, 216, 0.36);
      transform: translateY(-2px);
    }
    
    .points-value {
      font-size: 18px;
      color: #3B82F6;
      transition: all 0.3s ease;
    }
    
    .points-display.updated .points-value {
      animation: countPulse 0.4s ease-out;
    }
    
    .buttons-container {
      display: flex;
      gap: 8px;
      animation: slideUp 0.5s ease-out 0.1s both;
    }
    
    button { 
      padding: 8px 10px; 
      border-radius: 8px; 
      border: none; 
      color: white; 
      font-weight: 600;
      transition: all 0.18s ease;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
    }
    
    .buy-btn {
      background: linear-gradient(135deg, #1D4ED8, #2563EB);
      box-shadow: 0 3px 8px rgba(29, 78, 216, 0.24);
      animation: slideUp 0.5s ease-out 0.2s both;
      min-width: 52px;
      padding: 6px 8px;
      color: #001f3f;
    }
    
    .buy-btn:hover {
      transform: scale(1.1) translateY(-4px);
      background: linear-gradient(135deg, #3B82F6, #1D4ED8);
      box-shadow: 0 8px 20px rgba(29, 78, 216, 0.44);
    }
    
    .buy-btn:active {
      transform: scale(0.95);
    }
    
    .buy-btn small {
      font-size: 11px;
      opacity: 0.9;
    }
    
    /* Botón crear - especial */
    #createBtn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      background: linear-gradient(135deg, #1D4ED8, #2563EB);
      box-shadow: 0 3px 12px rgba(29, 78, 216, 0.34);
      animation: slideUp 0.5s ease-out 0.3s both, float 3s ease-in-out 0.5s infinite;
      flex-direction: row;
      gap: 0;
      color: #001f3f;
    }
    
    #createBtn:hover {
      transform: scale(1.15) translateY(-6px);
      box-shadow: 0 8px 24px rgba(29, 78, 216, 0.56), 0 0 0 4px rgba(29, 78, 216, 0.18);
      animation: float 3s ease-in-out infinite, pulse 2s ease-in-out infinite;
    }
    
    #createBtn:active {
      transform: scale(0.95);
      animation: none;
    }
    
    #createBtn span {
      display: inline-block;
      transition: transform 0.3s ease;
    }
    
    #createBtn:hover span {
      animation: spin 0.6s ease;
    }
  </style>
  <div class="container">
    <div class="points-display">
      <span>💎</span>
      <div>Puntos: <span class="points-value" id="pointsValue">0</span></div>
    </div>
    <div class="buttons-container">
      <button class="buy-btn" id="buyPoints">
        <span>+10</span>
        <small>puntos</small>
      </button>
      <button class="buy-btn" id="buyPoints2">
        <span>+20</span>
        <small>puntos</small>
      </button>
      <button class="buy-btn" id="buyPoints3">
        <span>+50</span>
        <small>puntos</small>
      </button>
      <button id="createBtn" title="Crear nueva criatura">
        <span>➕</span>
      </button>
    </div>
  </div>
`;

class MenuSecondary extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'}).appendChild(tpl.content.cloneNode(true));
    this._lastPoints = 0;
  }
  
  connectedCallback() {
    const pointsDisplay = this.shadowRoot.querySelector('.points-display');
    const pointsValue = this.shadowRoot.getElementById('pointsValue');
    
    // Actualizar display de puntos
    const updatePoints = () => {
      const current = PointsManager.instance().getPoints();
      pointsValue.textContent = current;
      
      // Animar si cambiaron
      if (this._lastPoints !== current) {
        this._lastPoints = current;
        pointsDisplay.classList.remove('updated');
        void pointsDisplay.offsetWidth; // trigger reflow
        pointsDisplay.classList.add('updated');
      }
    };
    
    // Inicial
    updatePoints();
    
    // Suscribirse a cambios
    window.addEventListener('game:pointsChanged', updatePoints);
    window.addEventListener('game:storageChanged', updatePoints);
    
    // Botones de comprar puntos
    this.shadowRoot.getElementById('buyPoints').onclick = () => {
      PointsManager.instance().addPoints(10);
    };
    
    this.shadowRoot.getElementById('buyPoints2').onclick = () => {
      PointsManager.instance().addPoints(20);
    };
    
    this.shadowRoot.getElementById('buyPoints3').onclick = () => {
      PointsManager.instance().addPoints(50);
    };
    
    // Botón crear criatura
    this.shadowRoot.getElementById('createBtn').onclick = () => {
      const modal = document.createElement('overlay-modal');
      modal.innerHTML = `<creature-create></creature-create>`;
      document.body.appendChild(modal);
    };
  }
}
customElements.define('menu-secondary', MenuSecondary);

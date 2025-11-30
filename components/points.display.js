// points-display.js
import { PointsManager } from '../logic/PointsManager.js';

const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes countUp { 0% { opacity: 0.5; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
    
    .chip { 
      padding:6px 10px; 
      border-radius:999px; 
      background: rgba(255,255,255,0.18); 
      color: white; 
      font-weight:600; 
      font-size:13px; 
      display:inline-block;
      transition: all 0.3s ease;
      animation: slideDown 0.4s ease-out;
    }
    
    .chip:hover {
      background: rgba(255,255,255,0.28);
      transform: scale(1.05);
    }
    
    .chip.pulse {
      animation: countUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  </style>
  <div class="chip" id="chip">Puntos: 0</div>
`;

class PointsDisplay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:'open'}).appendChild(tpl.content.cloneNode(true));
    this.el = this.shadowRoot.getElementById('chip');
    this.lastPoints = 0;
    this.update();
    window.addEventListener('game:pointsChanged', ()=> this.update());
    window.addEventListener('game:storageChanged', ()=> this.update());
  }
  update() {
    const p = PointsManager.instance().getPoints();
    this.el.textContent = `Puntos: ${p||0}`;
    
    // Animar cuando cambian los puntos
    if (this.lastPoints !== p) {
      this.lastPoints = p;
      this.el.classList.remove('pulse');
      void this.el.offsetWidth; // trigger reflow
      this.el.classList.add('pulse');
    }
  }
}
customElements.define('points-display', PointsDisplay);

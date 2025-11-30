// creature-create.js
// ============================================
// Modal para crear una nueva criatura
// Muestra un formulario con input del nombre y botones Crear/Cancelar
// Valida el nombre y comprueba si el jugador tiene suficientes puntos
// Primera criatura es GRATIS, las siguientes cuestan 20 puntos
// ============================================

import { CreatureManager } from '../logic/CreatureManager.js';
import { PointsManager } from '../logic/PointsManager.js';
import '../components/editable-name.js';
import { NameValidator } from '../logic/NameValidator.js';

const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
    
    h3{
      margin:0 0 8px 0;
      animation: slideInUp 0.4s ease-out;
    }
    
    input{
      width:100%;
      padding:8px;
      border-radius:8px;
      border:2px solid #ccc;
      margin-bottom:8px;
      transition: all 0.3s ease;
      animation: slideInUp 0.4s ease-out 0.1s both;
    }
    
    input:focus{
      outline: none;
      border-color: #00d4aa;
      box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
    }
    
    input.error{
      animation: shake 0.3s ease;
      border-color: #ef4444;
    }
    
    .cost-info {
      background: linear-gradient(135deg, rgba(0, 212, 170, 0.1), rgba(0, 168, 138, 0.1));
      border-left: 4px solid #00d4aa;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 12px;
      animation: slideInUp 0.4s ease-out 0.15s both;
      font-size: 14px;
      color: #00e5cc;
    }
    
    .cost-info.free {
      border-left-color: #00e5cc;
      background: linear-gradient(135deg, rgba(0, 229, 204, 0.1), rgba(0, 212, 170, 0.1));
    }
    
    .cost-label {
      font-weight: 600;
      color: #00e5cc;
    }
    
    .cost-value {
      font-weight: 700;
      font-size: 16px;
      animation: pulse 2s ease-in-out infinite;
    }
    
    .cost-info.free .cost-value {
      color: #00e5cc;
    }
    
    .cost-info:not(.free) .cost-value {
      color: #00d4aa;
    }
    
    .cost-warning {
      color: #ff7b7b;
      font-size: 12px;
      margin-top: 6px;
      font-weight: 600;
    }
    
    .buttons-section {
      display:flex;
      gap:8px;
      justify-content:flex-end;
      animation: slideInUp 0.4s ease-out 0.2s both;
    }
    
    button{
      padding:8px 10px;
      border-radius:6px;
      border:none;
      background:#3b82f6;
      color:white;
      transition: all 0.18s ease;
      cursor: pointer;
      font-weight: 600;
      font-size:13px;
    }
    
    button:hover{
      background:#2563eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    
    button:active{
      transform: translateY(0);
    }
    
    button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    button:disabled:hover {
      transform: none;
      box-shadow: none;
      background: #9ca3af;
    }
    
    #cancel {
      background: linear-gradient(135deg, #2b2b2b, #111827);
      color: #ff9b9b;
      border: 1px solid rgba(255, 123, 123, 0.06);
    }
    
    #cancel:hover{
      background: linear-gradient(135deg, #1f1f1f, #0f1722);
      box-shadow: 0 4px 12px rgba(255, 123, 123, 0.08);
    }
  </style>
  <div>
    <h3>Crear Criatura</h3>
    <editable-name id="name" value=""></editable-name>
    
    <div class="cost-info" id="costInfo">
      <div class="cost-label">Costo: <span class="cost-value" id="costValue">GRATIS</span></div>
      <div id="warningMsg"></div>
    </div>
    
    <div class="buttons-section">
      <button id="create">Crear</button>
      <button id="cancel" style="background:#ef4444">Cancelar</button>
    </div>
  </div>
`;

class CreatureCreate extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(tpl.content.cloneNode(true));
  }
  
  connectedCallback(){
    this.updateCostInfo();
    
    // Actualizar info cuando cambian puntos
    window.addEventListener('game:pointsChanged', ()=> this.updateCostInfo());
    window.addEventListener('game:storageChanged', ()=> this.updateCostInfo());
    
    this.shadowRoot.getElementById('create').onclick = () => {
      const nameEl = this.shadowRoot.getElementById('name');
      const name = (nameEl && nameEl.value) ? nameEl.value.trim() : '';
      const v = NameValidator.validate(name);
      if(!v.valid){
        // briefly highlight or show native alert
        alert(v.message);
        return;
      }
      const cost = this.getCost();
      const pointsManager = PointsManager.instance();
      
      // Verificar si tiene suficientes puntos
      if (cost > 0 && pointsManager.getPoints() < cost) {
        this.shadowRoot.getElementById('name').classList.add('error');
        setTimeout(() => {
          this.shadowRoot.getElementById('name').classList.remove('error');
        }, 300);
        alert(`No tienes suficientes puntos. Necesitas ${cost} puntos.`);
        return;
      }
      
      // Gastar puntos si no es la primera criatura
      if (cost > 0) {
        pointsManager.spendPoints(cost);
      }
      
      // Crear criatura
      CreatureManager.instance().create({ name });
      window.dispatchEvent(new Event('game:storageChanged'));
      
      const modal = this.closest('overlay-modal');
      if (modal) modal.remove();
    };
    
    this.shadowRoot.getElementById('cancel').onclick = () => {
      const modal = this.closest('overlay-modal');
      if (modal) modal.remove();
    };
  }
  
  getCost() {
    const creatureCount = CreatureManager.instance().all().length;
    // Primera criatura es gratis, a partir de la segunda cuesta 20 puntos
    return creatureCount === 0 ? 0 : 20;
  }
  
  updateCostInfo() {
    const cost = this.getCost();
    const costInfo = this.shadowRoot.getElementById('costInfo');
    const costValue = this.shadowRoot.getElementById('costValue');
    const warningMsg = this.shadowRoot.getElementById('warningMsg');
    const createBtn = this.shadowRoot.getElementById('create');
    const pointsManager = PointsManager.instance();
    const currentPoints = pointsManager.getPoints();
    
    if (cost === 0) {
      // Gratis
      costValue.textContent = '🎁 GRATIS';
      costInfo.classList.add('free');
      warningMsg.innerHTML = '';
      createBtn.disabled = false;
    } else {
      costValue.textContent = `💎 ${cost} puntos`;
      costInfo.classList.remove('free');
      
      // Verificar si tiene suficientes puntos
      if (currentPoints < cost) {
        warningMsg.innerHTML = `<div class="cost-warning">⚠️ Necesitas ${cost - currentPoints} puntos más</div>`;
        createBtn.disabled = true;
      } else {
        warningMsg.innerHTML = `<div style="color: #10b981; font-size: 12px; margin-top: 6px;">✓ Tienes suficientes puntos</div>`;
        createBtn.disabled = false;
      }
    }
  }
}
customElements.define('creature-create', CreatureCreate);

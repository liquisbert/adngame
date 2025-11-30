// evolve-selection.js
import { EvolutionManager } from '../logic/EvolutionManager.js';
import { CreatureManager } from '../logic/CreatureManager.js';
import { SPRITES } from '../config.js';

const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes itemPop { 0% { opacity: 0; transform: scale(0.8) rotateY(-20deg); } 100% { opacity: 1; transform: scale(1) rotateY(0); } }
    @keyframes glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); } }
    
    h3{
      margin:0 0 8px 0;
      animation: slideInUp 0.4s ease-out;
    }
    
    #desc {
      animation: slideInUp 0.4s ease-out 0.1s both;
      color: #00e5cc;
      margin-bottom: 8px;
    }
    
    .grid{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      animation: slideInUp 0.4s ease-out 0.2s both;
    }
    
    .item{
      padding:12px;
      border-radius:10px;
      background: linear-gradient(135deg, #0d1f3c, #112240);
      border:2px solid rgba(0,212,170,0.12);
      cursor:pointer;
      min-width:90px;
      text-align:center;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      animation: itemPop 0.5s ease-out;
      color: #00e5cc;
    }
    
    .item:nth-child(1) { animation-delay: 0.3s; }
    .item:nth-child(2) { animation-delay: 0.4s; }
    .item:nth-child(3) { animation-delay: 0.5s; }
    .item:nth-child(4) { animation-delay: 0.6s; }
    .item:nth-child(5) { animation-delay: 0.7s; }
    
    .item:hover{
      border-color: #00e5cc;
      background: linear-gradient(135deg, #112240, #1a3a50);
      transform: scale(1.08) translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 212, 170, 0.25);
    }
    
    .item:active{
      transform: scale(0.98);
    }
    
    .item div:first-child {
      font-size:24px;
      transition: all 0.3s ease;
    }
    
    .item:hover div:first-child {
      font-size: 32px;
      animation: glow 1.5s infinite;
    }
  </style>
  <div>
    <h3>Selecciona ADN</h3>
    <div id="desc"></div>
    <div class="grid" id="grid"></div>
  </div>
`;

class EvolveSelection extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(tpl.content.cloneNode(true));
    this.id = this.getAttribute('data-id');
  }
  connectedCallback(){
    const c = CreatureManager.instance().get(this.id);
    if(!c) return;
    const options = EvolutionManager.instance().optionsForLevel(c.level);
    this.shadowRoot.getElementById('desc').textContent = `Evolución a Nivel ${c.level}. Elige ADN:`;
    const grid = this.shadowRoot.getElementById('grid');
    grid.innerHTML = '';
    options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'item';
      item.innerHTML = `<div style="font-size:24px">${SPRITES[opt]||'?'}</div><div>${opt}</div>`;
      item.onclick = () => {
        const cm = CreatureManager.instance();
        cm.update(this.id, { spriteKey: opt, historyADN: [...(cm.get(this.id).historyADN||[]), opt] });
        window.dispatchEvent(new Event('game:storageChanged'));
        const modal = this.closest('overlay-modal');
        if(modal) modal.remove();
      };
      grid.appendChild(item);
    });
  }
}
customElements.define('evolve-selection', EvolveSelection);

// creature-card.js
import { CreatureManager } from '../logic/CreatureManager.js';
import { SPRITES } from '../config.js';

const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    @keyframes cardEntry { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes foodPulse { 0%, 100% { color: #6b7280; } 50% { color: #00d4aa; font-weight: 700; } }

    .card{
      position: relative;
      display:flex;
      flex-direction: column;
      gap:0;
      align-items:stretch;
      padding:0;
      min-height:110px;
      border-radius:10px;
      overflow: hidden;
      background: linear-gradient(180deg, #0b1b34, #0f2638);
      border: 1px solid rgba(0, 212, 170, 0.06);
      box-shadow:0 6px 12px rgba(0, 0, 0, 0.32);
      transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
      animation: cardEntry 0.32s ease-out;
      cursor: pointer;
      width: 100%;
      box-sizing: border-box;
      text-align: left;
    }
    .card:hover {
      transform: translateY(-5px);
      border-color: rgba(0, 212, 170, 0.14);
      box-shadow: 0 10px 22px rgba(0, 0, 0, 0.42);
    }
    .card:active { transform: translateY(-1px); }
    .card:focus { outline: none; box-shadow: 0 0 0 4px rgba(0,212,170,0.06); border-color: #00d4aa; }

    /* Image fills the card */
    .img{
      width:100%;
      height:120px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:44px;
      background: linear-gradient(135deg, rgba(0,212,170,0.08), rgba(0,168,138,0.06));
      transition: transform 0.22s ease, box-shadow 0.22s ease;
      box-shadow: inset 0 -6px 10px rgba(0,0,0,0.12);
      color: #fff;
    }
    .card:hover .img { transform: scale(1.03); }

    /* Overlay meta at bottom of image */
    .meta{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 8px 10px;
      background: linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.55));
      color: #fff;
      display: block;
    }
    .meta h4{
      margin:0;
      transition: color 0.2s ease;
      color: #ffffff;
      font-size: 14px;
      line-height: 1.1;
      word-break: break-word;
      white-space: normal;
    }
    .card:hover .meta h4 { color: #e6fffb; }

    .meta small{
      display:block;
      color: rgba(255,255,255,0.85);
      font-size: 12px;
      margin-top:4px;
      opacity: 0.95;
    }
    .food-updated { animation: foodPulse 0.6s ease-in-out; }
  </style>
  <div class="card" tabindex="0" role="button" aria-label="Ver detalles de criatura">
    <div class="img" id="avatar">?</div>
    <div class="meta">
      <h4 id="title">Nombre</h4>
      <small id="subtitle">Nv.1 • Food:0</small>
    </div>
  </div>
`;

class CreatureCard extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(tpl.content.cloneNode(true));
    this._id = null;
    this._lastFoodPoints = 0;
  }

  set creatureId(id) {
    this._id = id;
    this.render();
  }

  connectedCallback() {
    const openDetail = () => {
      const modal = document.createElement('overlay-modal');
      modal.innerHTML = `<creature-detail data-id="${this._id}"></creature-detail>`;
      document.body.appendChild(modal);
    };

    const cardEl = this.shadowRoot.querySelector('.card');
    if (cardEl) {
      cardEl.onclick = openDetail;
      cardEl.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail();
        }
      };
    }

    window.addEventListener('game:storageChanged', ()=> this.render());
  }

  render(){
    if(!this._id) return;
    const c = CreatureManager.instance().get(this._id);
    if(!c) return;
    
    this.shadowRoot.getElementById('title').textContent = c.name;
    
    // Detectar cambio de comida y animar
    const subtitleEl = this.shadowRoot.getElementById('subtitle');
    if (this._lastFoodPoints !== c.foodPoints) {
      this._lastFoodPoints = c.foodPoints;
      subtitleEl.classList.remove('food-updated');
      void subtitleEl.offsetWidth; // trigger reflow
      subtitleEl.classList.add('food-updated');
    }
    
    subtitleEl.textContent = `Nv.${c.level} • Food: ${c.foodPoints||0}`;
    
    const key = c.spriteKey || (c.level === 1 ? 'sombra' : (c.historyADN && c.historyADN.length ? c.historyADN[c.historyADN.length-1] : 'sombra'));
    this.shadowRoot.getElementById('avatar').textContent = SPRITES[key] || '?';
  }
}
customElements.define('creature-card', CreatureCard);

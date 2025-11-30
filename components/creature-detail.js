// creature-detail.js
import { CreatureManager } from '../logic/CreatureManager.js';
import { PointsManager } from '../logic/PointsManager.js';
import { EvolutionManager } from '../logic/EvolutionManager.js';
import { FusionManager } from '../logic/FusionManager.js';
import { SPRITES } from '../config.js';

const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>
    @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes popOut { 0% { transform: scale(0.8); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
    @keyframes petFloatUp { 
      0% { 
        opacity: 1; 
        transform: translate(0, 0) scale(1);
      } 
      100% { 
        opacity: 0; 
        transform: translate(0, -60px) scale(1.2);
      } 
    }
    
    .wrap{
      display:flex;
      flex-direction:column;
      gap:8px;
      animation: slideInUp 0.4s ease-out;
      position: relative;
    }
    
    .head{
      display:flex;
      gap:12px;
      align-items:center;
      position: relative;
    }
    
    .avatar{
      width:110px;
      height:110px;
      border-radius:12px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:56px;
      background: linear-gradient(135deg, rgba(0, 212, 170, 0.2), rgba(0, 168, 138, 0.2));
      border: 2px solid #00d4aa;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    
    .avatar:hover {
      background: linear-gradient(135deg, rgba(0, 212, 170, 0.3), rgba(0, 168, 138, 0.3));
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
    }
    
    .avatar:active {
      transform: scale(0.98);
    }
    
    .avatar.feed-animation {
      animation: popOut 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .avatar.pet-animation {
      animation: popOut 0.4s ease-out;
    }
    
    .pet-feedback {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      font-weight: 700;
      pointer-events: none;
      color: #00e5cc;
      text-shadow: 0 2px 4px rgba(0, 212, 170, 0.3);
    }
    
    .pet-feedback.show {
      animation: petFloatUp 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    
    .meta{
      flex:1;
    }
    /* Barra de comida: contenedor y relleno */
    #foodBar { margin-top:8px; }
    .food-label { color: #0b1220; font-weight:600; margin-bottom:6px; }
    .bar{ width:100%; height:12px; background: rgba(13,31,60,0.24); border-radius:8px; overflow:hidden; border:1px solid rgba(0,0,0,0.18); }
    .bar-fill{ height:100%; width:0%; background: linear-gradient(90deg,#00d4aa,#00a88a); transition: width 0.3s ease; }
    
    h3{
      margin:0;
      transition: color 0.3s ease;
      display:flex;
      align-items:center;
      gap:8px;
    }

    .edit-name{
      font-size:14px;
      color:#9eeed4;
      background:transparent;
      border:none;
      cursor:pointer;
      padding:4px;
      border-radius:6px;
      transition: background 0.15s ease;
    }

    .edit-name:hover{
      background: rgba(0,212,170,0.06);
    }

    input.name-input{
      font-size:18px;
      padding:4px 8px;
      border-radius:6px;
      border:1px solid rgba(0,212,170,0.12);
      background: rgba(13,31,60,0.85);
      color: #dffbf0;
      outline: none;
    }
    
    small{
      color:#6b7280;
      transition: color 0.3s ease;
    }
    
    .controls{
      display:flex;
      gap:6px;
      margin-top:6px;
      flex-wrap:wrap;
    }
    
    button{
      padding:6px 8px;
      border-radius:6px;
      border:none;
      background: linear-gradient(135deg, #00d4aa, #00a88a);
      color:#001f3f;
      transition: all 0.18s ease;
      cursor: pointer;
      font-weight: 600;
      font-size:13px;
    }
    
    button:hover{
      background: linear-gradient(135deg, #00e5cc, #00d4aa);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 212, 170, 0.4);
    }
    
    button:active{
      transform: translateY(0);
    }
    
    .danger{
      background:#ef4444;
    }
    .danger:hover{
      background:#dc2626;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }
    
    .muted{
      background:#94a3b8;
    }
    .muted:hover{
      background:#78909c;
      box-shadow: 0 4px 12px rgba(148, 163, 184, 0.4);
    }
    
    .fusion-list{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      margin-top:8px;
      animation: slideInUp 0.3s ease-out;
    }
    
    .mini{
      padding:6px;
      border-radius:8px;
      background: linear-gradient(135deg, #0d1f3c, #112240);
      border:2px solid #00d4aa;
      cursor:pointer;
      transition: all 0.2s ease;
      color: #00e5cc;
    }
    
    .mini:hover{
      border-color: #00e5cc;
      background: linear-gradient(135deg, #112240, #1a3a50);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
    }
    
    .mini:active{
      transform: translateY(0);
    }
    
    #fuseSection {
      transition: all 0.3s ease;
    }
  </style>
  <div class="wrap">
    <div class="head">
      <div class="avatar" id="avatar">?</div>
      <div class="pet-feedback" id="petFeedback"></div>
      <div class="meta">
        <div id="nameWrap"><h3 id="name">Nombre</h3></div>
        <small id="level">Nv.1</small>
        <div id="foodBar">
          <div class="food-label" id="foodLabel">Comida: 0</div>
          <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="bar-fill" id="foodFill" style="width:0%"></div>
          </div>
        </div>
        <div style="margin-top:8px" class="controls">
          <button id="feed">Alimentar (gasta 1 punto)</button>
          <button id="selectFuse" class="muted">Fusionar</button>
          <button id="delete" class="danger">Eliminar</button>
        </div>
      </div>
    </div>

    <div id="fuseSection" style="display:none">
      <small>Selecciona otra criatura del mismo nivel para fusionar:</small>
      <div id="fusionList" class="fusion-list"></div>
    </div>
  </div>
`;

class CreatureDetail extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:'open'}).appendChild(tpl.content.cloneNode(true));
    this.id = this.getAttribute('data-id');
  }

  connectedCallback(){
    this.render();
    
    // Agregar listener para acariciar al hacer click en el avatar
    const avatar = this.shadowRoot.getElementById('avatar');
    avatar.onclick = () => this.pet();
    
    this.shadowRoot.getElementById('feed').onclick = ()=> this.feed();
    this.shadowRoot.getElementById('delete').onclick = ()=> this.delete();
    this.shadowRoot.getElementById('selectFuse').onclick = ()=> this.showFuseOptions();
    window.addEventListener('game:storageChanged', ()=> this.render());
    window.addEventListener('game:pointsChanged', ()=> this.render());
  }

  /** Inicia la edición inline del nombre */
  startEditName(){
    const nameEl = this.shadowRoot.getElementById('name');
    if(!nameEl) return;
    const current = nameEl.childNodes[0] && nameEl.childNodes[0].nodeType === Node.TEXT_NODE ? nameEl.childNodes[0].textContent.trim() : nameEl.textContent.trim();
    // Reemplazar el contenido del h3 por un input
    nameEl.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'name-input';
    input.value = current || '';
    nameEl.appendChild(input);
    // Añadir un botón guardar sencillo
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Guardar';
    saveBtn.style.marginLeft = '8px';
    saveBtn.className = 'edit-name';
    nameEl.appendChild(saveBtn);

    input.focus();
    input.select();

    const finish = (save) => {
      const val = input.value.trim();
      if(save && val.length){
        CreatureManager.instance().update(this.id, { name: val });
        window.dispatchEvent(new Event('game:storageChanged'));
      }
      // restore header
      this.render();
    };

    const onKey = (ev) => {
      if(ev.key === 'Enter') { finish(true); }
      else if(ev.key === 'Escape') { finish(false); }
    };

    const onBlur = () => finish(true);

    input.addEventListener('keydown', onKey);
    input.addEventListener('blur', onBlur);
    saveBtn.onclick = () => finish(true);
  }

  render(){
    const c = CreatureManager.instance().get(this.id);
    if(!c) return;
    // Render name via editable-name component
    const nameWrap = this.shadowRoot.getElementById('nameWrap');
    nameWrap.innerHTML = '';
    const en = document.createElement('editable-name');
    en.setAttribute('data-id', this.id);
    nameWrap.appendChild(en);
    this.shadowRoot.getElementById('level').textContent = `Nv.${c.level}`;
    // Calcular porcentaje de comida hacia la siguiente evolución
    const needed = EvolutionManager.instance().requiredFoodForLevel(c.level + 1) || 1;
    const current = c.foodPoints || 0;
    const percent = Math.min(100, Math.round((current / needed) * 100));
    const fill = this.shadowRoot.getElementById('foodFill');
    const label = this.shadowRoot.getElementById('foodLabel');
    if(fill){
      fill.style.width = percent + '%';
      const bar = fill.parentElement;
      if(bar) bar.setAttribute('aria-valuenow', String(percent));
    }
    if(label){
      if(current >= needed){
        label.textContent = `${current}/${needed} - Listo para evolucionar`;
      } else {
        label.textContent = `${current}/${needed} comida (${percent}%)`;
      }
    }
    const key = c.spriteKey || (c.level ===1 ? 'sombra' : (c.historyADN && c.historyADN.length ? c.historyADN[c.historyADN.length-1] : 'sombra'));
    this.shadowRoot.getElementById('avatar').textContent = SPRITES[key] || '?';
  }

  /**
   * Acariciar la criatura - gana 2 puntos
   */
  pet() {
    const pts = PointsManager.instance();
    pts.addPoints(2);
    
    // Animar el avatar
    const avatar = this.shadowRoot.getElementById('avatar');
    avatar.classList.remove('pet-animation');
    void avatar.offsetWidth; // trigger reflow
    avatar.classList.add('pet-animation');
    
    // Mostrar feedback +2 flotante
    this.showPetFeedback();
  }

  /**
   * Mostrar animación de +2 puntos flotando
   */
  showPetFeedback() {
    const petFeedback = this.shadowRoot.getElementById('petFeedback');
    petFeedback.textContent = '+2 💚';
    petFeedback.classList.remove('show');
    void petFeedback.offsetWidth; // trigger reflow
    petFeedback.classList.add('show');
    
    // Limpiar después de la animación (1.5 segundos)
    setTimeout(() => {
      petFeedback.classList.remove('show');
      petFeedback.textContent = '';
    }, 1500);
  }

  feed(){
    const pts = PointsManager.instance();
    const ok = pts.spendPoints(1);
    if(!ok) { alert('No tienes puntos suficientes.'); return; }
    const c = CreatureManager.instance().get(this.id);
    c.feed(1);
    
    // Agregar animación al avatar
    const avatar = this.shadowRoot.getElementById('avatar');
    avatar.classList.remove('feed-animation');
    void avatar.offsetWidth; // trigger reflow
    avatar.classList.add('feed-animation');
    
    CreatureManager.instance().update(this.id, { foodPoints: c.foodPoints });
    window.dispatchEvent(new Event('game:storageChanged'));
  }

  delete(){
    if(!confirm('Eliminar criatura?')) return;
    CreatureManager.instance().remove(this.id);
    window.dispatchEvent(new Event('game:storageChanged'));
    const modal = this.closest('overlay-modal');
    if(modal) modal.remove();
  }

  showFuseOptions(){
    const c = CreatureManager.instance().get(this.id);
    if(!c) return;
    const list = CreatureManager.instance().all().filter(x => x.id !== c.id && x.level === c.level);
    if(list.length === 0){ alert('No hay criaturas del mismo nivel para fusionar.'); return; }
    this.shadowRoot.getElementById('fuseSection').style.display = 'block';
    const container = this.shadowRoot.getElementById('fusionList');
    container.innerHTML = '';
    list.forEach(other => {
      const btn = document.createElement('div');
      btn.className = 'mini';
      btn.textContent = `${other.name} (Food:${other.foodPoints})`;
      btn.onclick = () => this.tryFuseWith(other.id);
      container.appendChild(btn);
    });
  }

  tryFuseWith(otherId) {
    const cm = CreatureManager.instance();
    const a = cm.get(this.id);
    const b = cm.get(otherId);
    const fm = FusionManager.instance();
    if(!fm.canFuse(a,b)){
      alert('No cumplen requisitos de food o nivel para fusionar.');
      return;
    }
    const newC = fm.fuse(a.id, b.id);
    window.dispatchEvent(new Event('game:storageChanged'));
    // show ADN options if exist
    const opts = EvolutionManager.instance().optionsForLevel(newC.level);
    if(opts && opts.length) {
      const modal = document.createElement('overlay-modal');
      modal.innerHTML = `<evolve-selection data-id="${newC.id}"></evolve-selection>`;
      document.body.appendChild(modal);
    } else {
      // fallback: set sprite to last history
      const key = newC.historyADN.length ? newC.historyADN[newC.historyADN.length-1] : null;
      if(key) CreatureManager.instance().update(newC.id, { spriteKey: key });
    }
    const modal = this.closest('overlay-modal');
    if(modal) modal.remove();
  }
}
customElements.define('creature-detail', CreatureDetail);
